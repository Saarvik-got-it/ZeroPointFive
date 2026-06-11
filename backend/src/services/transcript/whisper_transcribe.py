import sys
import os
import json
import traceback

# Resolve DLL paths on Windows for nvidia packages
if sys.platform == "win32":
    try:
        import os
        import site
        paths = []
        try:
            paths.extend(site.getsitepackages())
        except AttributeError:
            pass
        try:
            paths.append(site.getusersitepackages())
        except AttributeError:
            pass
        for sp in paths:
            for sub in ["bin", "lib"]:
                cublas_path = os.path.join(sp, "nvidia", "cublas", sub)
                cudnn_path = os.path.join(sp, "nvidia", "cudnn", sub)
                if os.path.exists(cublas_path):
                    os.add_dll_directory(cublas_path)
                    os.environ["PATH"] = cublas_path + os.path.pathsep + os.environ["PATH"]
                if os.path.exists(cudnn_path):
                    os.add_dll_directory(cudnn_path)
                    os.environ["PATH"] = cudnn_path + os.path.pathsep + os.environ["PATH"]
    except Exception:
        pass

def log(msg):
    print(msg, file=sys.stderr, flush=True)

def main():
    if len(sys.argv) < 2:
        log("Error: Missing audio file path argument.")
        sys.exit(1)
        
    audio_path = sys.argv[1]
    if not os.path.exists(audio_path):
        log(f"Error: Audio file not found at {audio_path}")
        sys.exit(1)
        
    model_size = os.getenv("WHISPER_MODEL", "large-v3")
    whisper_model_dir = os.getenv("WHISPER_MODEL_DIR", "./backend/models/whisper")
    device = os.getenv("WHISPER_DEVICE", "auto")
    compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "auto")
    
    # Auto-detect device
    if device == "auto":
        device = "cuda"

    # Configure compute type based on device
    if compute_type == "auto":
        if device == "cuda":
            compute_type = "float16"
        else:
            compute_type = "int8"
            
    # Print GPU Detection and Logging information at startup (requirement 7)
    log(f"\n[Whisper] Model: {model_size}")
    log(f"[Whisper] Device: {device.upper()}")
    log(f"[Whisper] Compute Type: {compute_type}")
    log(f"[Whisper] Model Download Directory: {os.path.abspath(whisper_model_dir)}\n")
    
    from faster_whisper import WhisperModel
    
    # Initial Hinglish optimization prompt (verbatim transcription requirement 6)
    initial_prompt = (
        "A podcast conversation in Hinglish (a mix of Hindi and English). "
        "Please transcribe the words verbatim, preserving English words in Latin script "
        "and Hindi words in Devanagari script (like 'कॉर्पोरेट मजदूर', 'रिस्क', 'स्टार्टअप') without translation."
    )
    
    try:
        model = WhisperModel(
            model_size, 
            device=device, 
            compute_type=compute_type, 
            download_root=whisper_model_dir
        )
        log("[Whisper] Transcribing...")
        # Run transcription
        segments, info = model.transcribe(
            audio_path,
            beam_size=5,
            initial_prompt=initial_prompt,
            condition_on_previous_text=False
        )
    except Exception as e:
        log(f"[Whisper] Failed to load model or transcribe on '{device}' with compute_type '{compute_type}': {str(e)}")
        if device == "cuda":
            log("[Whisper] Falling back to CPU with int8 compute type...")
            device = "cpu"
            compute_type = "int8"
            model = WhisperModel(
                model_size, 
                device=device, 
                compute_type=compute_type, 
                download_root=whisper_model_dir
            )
            log("[Whisper] Transcribing (CPU fallback)...")
            segments, info = model.transcribe(
                audio_path,
                beam_size=5,
                initial_prompt=initial_prompt,
                condition_on_previous_text=False
            )
        else:
            raise e
    
    log(f"[Whisper] Detected language: '{info.language}' with probability {info.language_probability:.2f}")
    log(f"[Whisper] Audio duration: {info.duration:.2f} seconds")
    
    full_text_segments = []
    structured_segments = []
    
    for segment in segments:
        # Convert timestamps to format for logs
        start_min = int(segment.start // 60)
        start_sec = int(segment.start % 60)
        end_min = int(segment.end // 60)
        end_sec = int(segment.end % 60)
        log(f"[Whisper] Processing segment... [{start_min:02d}:{start_sec:02d} -> {end_min:02d}:{end_sec:02d}]: {segment.text}")
        
        full_text_segments.append(segment.text)
        structured_segments.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip()
        })
        
    log("[Whisper] Transcript complete.")
    
    # Compile the final payload matching the segment requirements
    output_payload = {
        "text": " ".join(full_text_segments).strip(),
        "language": info.language,
        "duration": round(info.duration, 2),
        "segments": structured_segments
    }
    
    # Output the final JSON string to stdout
    print(json.dumps(output_payload))

if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        log(f"[Whisper] Transcription process crashed: {str(err)}")
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
