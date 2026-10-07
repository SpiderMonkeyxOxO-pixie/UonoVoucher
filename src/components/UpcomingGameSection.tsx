import { useEffect, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/format';
import './UpcomingGameSection.css';

const TELEGRAM_CHANNEL_URL = 'https://t.me/OfficialUonovoucher';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: number): TimeLeft | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function useCountdown(target: number): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

interface UpcomingGameSectionProps {
  /** Display name, e.g. "Jaiho Play". */
  name: string;
  /** Path under /public, e.g. "/games/jaiho-play.webp". */
  image: string;
  /** Launch instant as an ISO 8601 timestamp with UTC offset. */
  releaseDate: string;
  /** Human-readable launch time, e.g. "12:00 PM IST". */
  releaseTimeLabel: string;
}

export function UpcomingGameSection({ name, image, releaseDate, releaseTimeLabel }: UpcomingGameSectionProps) {
  const timeLeft = useCountdown(new Date(releaseDate).getTime());

  return (
    <section className="section upcoming-game-section" aria-labelledby="upcoming-game-heading">
      <div className="container">
        <div className="upcoming-game-card">
          <div className="upcoming-game-top-row">
            <img src={image} alt={`${name} logo`} className="upcoming-game-image" width={128} height={128} />
            {timeLeft ? (
              <div className="countdown" role="timer" aria-label={`Time remaining until ${name} launch`}>
                <div className="countdown-unit">
                  <span className="countdown-value">{timeLeft.days}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="countdown-label">Hrs</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="countdown-label">Min</span>
                </div>
                <div className="countdown-unit">
                  <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="countdown-label">Sec</span>
                </div>
              </div>
            ) : (
              <div className="countdown-live">{name}&apos;s announced launch time has passed</div>
            )}
          </div>

          <div className="upcoming-game-body">
            <div className="upcoming-game-top">
              <span className="eyebrow">Coming soon</span>
              <StatusBadge status="scheduled" />
            </div>
            <h2 id="upcoming-game-heading">{name} is joining the Uono catalogue</h2>
            <p>
              Expected to launch at {releaseTimeLabel} on {formatDate(releaseDate.slice(0, 10))}. We&apos;ll add
              category, promo-code, voucher and safety information once the game is available and can be
              independently reviewed.
            </p>
            <div className="upcoming-game-actions">
              <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                Join Telegram for launch updates
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
