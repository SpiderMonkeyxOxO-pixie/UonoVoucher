import { useEffect, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../utils/format';
import './UpcomingGameSection.css';

const TELEGRAM_CHANNEL_URL = 'https://t.me/OfficialUonovoucher';

const RELEASE_TARGET = new Date('2026-08-19T08:00:00+05:30').getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft | null {
  const diff = RELEASE_TARGET - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function useCountdown(): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

export function UpcomingGameSection() {
  const timeLeft = useCountdown();

  return (
    <section className="section upcoming-game-section">
      <div className="container">
        <div className="upcoming-game-card">
          <div className="upcoming-game-top-row">
            <img src="/games/gold-rummy.png" alt="" className="upcoming-game-image" width={128} height={128} />
            {timeLeft ? (
              <div className="countdown" role="timer" aria-label="Time remaining until Gold Rummy launch">
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
              <div className="countdown-live">Gold Rummy&apos;s announced launch window has passed</div>
            )}
          </div>

          <div className="upcoming-game-body">
            <div className="upcoming-game-top">
              <span className="eyebrow">Coming soon</span>
              <StatusBadge status="scheduled" />
            </div>
            <h2>Gold Rummy is joining the Uono catalogue</h2>
            <p>
              Expected to launch between 8:00–9:00 AM IST on {formatDate('2026-08-19')}. We&apos;ll add category,
              promo-code, voucher and safety information once the game is available and can be independently
              reviewed.
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
