"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "./button";
// Removed next-intl dependency

interface VoiceRecorderProps {
  onAudioReady: (file: File | null, url: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onAudioReady, disabled }) => {
  // Removed useTranslations - using hardcoded English
  const [modalOpen, setModalOpen] = React.useState(false);
  const [recording, setRecording] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [showConfirmClose, setShowConfirmClose] = React.useState(false);
  const [pendingClose, setPendingClose] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);

  React.useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  const startRecording = async () => {
    setError(null);
    setAudioUrl(null);
    setAudioFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size < 100) {
          setError("Recording too short. Please record for at least 3 seconds.");
          return;
        }
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
        setAudioFile(file);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      setError("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setAudioFile(null);
    setError(null);
    onAudioReady(null, "");
  };

  const confirmRecording = () => {
    if (audioFile && audioUrl) {
      onAudioReady(audioFile, audioUrl);
      setModalOpen(false);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!open && recording) {
      stopRecording();
    }
    if (!open && (recording || audioUrl)) {
      setShowConfirmClose(true);
      setPendingClose(open);
      return;
    }
    setModalOpen(open);
  };

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={() => setModalOpen(true)} disabled={disabled}>
        Record
      </Button>
      {audioUrl && (
        <div className="flex items-center gap-2 mt-2">
          <audio ref={audioRef} src={audioUrl} controls className="ml-2" />
          <Button type="button" variant="secondary" onClick={clearRecording}>Clear</Button>
        </div>
      )}
      <Dialog open={modalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Voice Recorder</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {error && <div className="text-destructive text-xs mt-1">{error}</div>}
            {!recording && !audioUrl && (
              <Button type="button" onClick={startRecording} disabled={disabled}>Start Recording</Button>
            )}
            {recording && (
              <Button type="button" variant="destructive" onClick={stopRecording}>Stop</Button>
            )}
            {audioUrl && !recording && (
              <>
                <audio ref={audioRef} src={audioUrl} controls className="w-full mt-2" />
                <div className="flex gap-2 mt-2">
                  <Button type="button" variant="secondary" onClick={clearRecording}>Clear</Button>
                  <Button type="button" variant="default" onClick={confirmRecording}>Confirm</Button>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 