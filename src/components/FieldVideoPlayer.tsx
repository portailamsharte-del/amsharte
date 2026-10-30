import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  Video, 
  Clock, 
  Share2, 
  Sparkles,
  MapPin
} from 'lucide-react';

interface FieldVideoPlayerProps {
  title: string;
  caption: string;
  duration?: string;
  location?: string;
  isExample?: boolean;
  onReplace?: () => void;
  videoUrl?: string;
}

export const FieldVideoPlayer: React.FC<FieldVideoPlayerProps> = ({
  title,
  caption,
  duration = "02:14",
  location = "Plage de Togbin Fandji",
  isExample = true,
  onReplace,
  videoUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1.2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-cyan-800/60 shadow-xl mx-5 sm:mx-6 my-4">
      {/* Top Banner indicating Example & Replacement */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40">
            <Video className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            Vidéo de Terrain • Suivi Écologique
          </span>
        </div>

        {onReplace && (
          <button
            onClick={onReplace}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>🔄 Remplacer cette vidéo</span>
          </button>
        )}
      </div>

      {/* Video Screen Area */}
      <div className="relative aspect-video max-h-[320px] bg-slate-950 flex items-center justify-center overflow-hidden group">
        {/* If custom external video URL or uploaded media */}
        {videoUrl ? (
          videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
            <iframe 
              src={videoUrl} 
              className="w-full h-full border-0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
            />
          ) : videoUrl.startsWith('data:image') || videoUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) ? (
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
              <img 
                src={videoUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded-md text-2xs text-cyan-300 font-mono flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{location}</span>
              </div>
            </div>
          ) : (
            /* Native HTML5 Video for MP4, WebM, data:video, or local blob */
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-contain bg-black"
              playsInline
            />
          )
        ) : (
          <>
            {/* Visual Cinematic / Animated Coastal Beach Simulation for the video example */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-10" />
            
            <img 
              src="https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1200&q=80" 
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105 filter brightness-105' : 'scale-100 filter brightness-90'}`}
            />

            {/* Video overlay graphic simulating night/dawn marine turtle release */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-5 pointer-events-none">
              {/* Rec Indicator / Night Vision Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-700 text-2xs font-mono text-emerald-400">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                  <span>{isPlaying ? 'LECTURE' : 'PAUSE'}</span>
                </div>

                <div className="bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-700 text-2xs text-slate-300 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{duration}</span>
                </div>
              </div>

              {/* Central Play/Pause Watermark Button */}
              <div className="self-center pointer-events-auto">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Lire la vidéo'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-slate-950" />
                  ) : (
                    <Play className="w-7 h-7 fill-slate-950 ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Video Subtitle / Caption */}
              <div className="bg-slate-950/80 backdrop-blur-xs p-2.5 rounded-lg border border-slate-800 text-xs">
                <p className="text-slate-200 font-medium line-clamp-1">
                  {caption}
                </p>
                <div className="flex items-center gap-2 text-2xs text-cyan-300 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Video Progress Scrubber Bar */}
      <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setProgress(0)}
          className="text-slate-400 hover:text-white transition cursor-pointer"
          title="Recommencer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Progress bar */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setProgress(clickPos * 100);
          }}
          className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative"
        >
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timecode */}
        <span className="text-2xs font-mono text-slate-400 shrink-0">
          {Math.floor((progress / 100) * 134)}s / {duration}
        </span>

        {/* Mute toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-400 hover:text-white transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
