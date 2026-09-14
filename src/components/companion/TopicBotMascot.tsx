import React from 'react';
import { TopicBotMood } from '../../types';

interface TopicBotMascotProps {
  mood?: TopicBotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isFloating?: boolean;
  onClick?: () => void;
}

export const TopicBotMascot: React.FC<TopicBotMascotProps> = ({
  mood = 'greeting',
  size = 'md',
  className = '',
  isFloating = true,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative select-none inline-flex items-center justify-center shrink-0 ${
        isFloating ? 'animate-[bounce_3s_ease-in-out_infinite]' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      title="토픽이 (Topic-bot)"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} drop-shadow-md transition-transform duration-200 hover:scale-105 active:scale-95`}
      >
        {/* Ambient Glow */}
        <circle cx="50" cy="50" r="46" fill="#6C47FF" fillOpacity="0.12" />

        {/* Top Antenna */}
        <path
          d="M50 18V9"
          stroke="#6C47FF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="8" r="4.5" fill="#6C47FF" />
        <circle cx="50" cy="8" r="2.5" fill="#FFFFFF" className="animate-pulse" />

        {/* Head Outer Shell (Chubby Cute Geometry) */}
        <rect
          x="18"
          y="18"
          width="64"
          height="54"
          rx="22"
          fill="#6C47FF"
          stroke="#5530E5"
          strokeWidth="2"
        />

        {/* Side Headset Ear Cups */}
        {/* Left Ear */}
        <rect x="11" y="32" width="7" height="26" rx="3.5" fill="#3D20B2" />
        <rect x="13" y="36" width="3" height="18" rx="1.5" fill="#F0ECFF" />

        {/* Right Ear */}
        <rect x="82" y="32" width="7" height="26" rx="3.5" fill="#3D20B2" />
        <rect x="84" y="36" width="3" height="18" rx="1.5" fill="#F0ECFF" />

        {/* Inner Screen / Visor (Dark Tech Glass) */}
        <rect
          x="25"
          y="25"
          width="50"
          height="40"
          rx="15"
          fill="#131722"
        />

        {/* Visor Specular Highlight */}
        <path
          d="M29 32C33 28 40 27 48 27"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />

        {/* Mood-Specific Eyes & Expressions */}
        {mood === 'greeting' && (
          <g>
            {/* Friendly Happy Arc Eyes (^^) */}
            <path
              d="M34 46C34 42 42 42 42 46"
              stroke="#A288FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M58 46C58 42 66 42 66 46"
              stroke="#A288FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Cute Cheek Blush */}
            <circle cx="33" cy="52" r="3" fill="#FF5E7E" fillOpacity="0.6" />
            <circle cx="67" cy="52" r="3" fill="#FF5E7E" fillOpacity="0.6" />
            {/* Open Happy Smile */}
            <path
              d="M45 51C47 54 53 54 55 51"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {mood === 'docent' && (
          <g>
            {/* Inquisitive Docent Eyes with Analysis HUD Lines */}
            <circle cx="39" cy="44" r="5.5" fill="#60A5FA" />
            <circle cx="61" cy="44" r="5.5" fill="#60A5FA" />
            <circle cx="41" cy="42" r="2" fill="#FFFFFF" />
            <circle cx="63" cy="42" r="2" fill="#FFFFFF" />
            {/* Smart Glasses Frame */}
            <path
              d="M31 44H47M53 44H69M47 44C49 42 51 42 53 44"
              stroke="#FCD34D"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Micro Smile */}
            <path
              d="M47 54H53"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {mood === 'cheering' && (
          <g>
            {/* Star Sparkle Eyes */}
            <path
              d="M38 38L40 43L45 44L40 46L38 51L36 46L31 44L36 43L38 38Z"
              fill="#FCD34D"
            />
            <path
              d="M62 38L64 43L69 44L64 46L62 51L60 46L55 44L60 43L62 38Z"
              fill="#FCD34D"
            />
            {/* Big Enthusiastic Grin */}
            <path
              d="M44 51C46 56 54 56 56 51"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {mood === 'commiserating' && (
          <g>
            {/* Empathetic / Funny Loss Sympathy Eyes */}
            <path
              d="M34 42L42 47"
              stroke="#93C5FD"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M66 42L58 47"
              stroke="#93C5FD"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Funny Sweat / Tear Droplet */}
            <path
              d="M69 36C69 38 67 41 67 41C67 41 65 38 65 36C65 34.9 65.9 34 67 34C68.1 34 69 34.9 69 36Z"
              fill="#38BDF8"
            />
            {/* Wobbly Comfort Smile */}
            <path
              d="M44 54C47 52 53 56 56 53"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {mood === 'mentor' && (
          <g>
            {/* CEO Wink (Left Eye Wink, Right Eye Shimmer) */}
            <path
              d="M34 46C34 43 42 43 42 46"
              stroke="#A288FF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="61" cy="44" r="5" fill="#A288FF" />
            <circle cx="62" cy="42" r="1.8" fill="#FFFFFF" />
            {/* Smug / Confident Tech Leader Smile */}
            <path
              d="M46 52C48 55 54 54 56 52"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {mood === 'quest' && (
          <g>
            {/* Shield Focus Eyes */}
            <circle cx="39" cy="44" r="4.5" fill="#34D399" />
            <circle cx="61" cy="44" r="4.5" fill="#34D399" />
            <circle cx="40" cy="43" r="1.8" fill="#FFFFFF" />
            <circle cx="62" cy="43" r="1.8" fill="#FFFFFF" />
            {/* Serious Determined Smile */}
            <path
              d="M45 53H55"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {mood === 'neutral' && (
          <g>
            <circle cx="39" cy="44" r="4.5" fill="#A288FF" />
            <circle cx="61" cy="44" r="4.5" fill="#A288FF" />
            <circle cx="40.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <circle cx="62.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <path
              d="M46 53H54"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Little CEO Tie / Investor Collar at Bottom */}
        <path
          d="M44 72L50 78L56 72V68H44V72Z"
          fill="#FCD34D"
          stroke="#EAB308"
          strokeWidth="1"
        />
        <path d="M50 78L47 88L50 91L53 88L50 78Z" fill="#F59E0B" />
      </svg>

      {/* Online Pulse Dot */}
      <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
      </span>
    </div>
  );
};
