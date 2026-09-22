import { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState({ type: 'idle', message: '' });

  const resetFeedback = () => {
    if (feedback.type !== 'idle') {
      setFeedback({ type: 'idle', message: '' });
    }
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
    resetFeedback();
  };

  const handleBlur = () => {
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setFeedback({ type: 'error', message: '請輸入完整的 Email，例如 hello@example.com。' });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setFeedback({ type: 'error', message: '請先輸入 Email。' });
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setFeedback({ type: 'error', message: '請輸入完整的 Email，例如 hello@example.com。' });
      return;
    }

    setEmail(normalizedEmail);
    setFeedback({
      type: 'success',
      message: 'Email 格式確認完成。目前仍是展示流程，尚未建立訂閱資料。',
    });
  };

  const feedbackId = 'newsletter-feedback';
  const noteId = 'newsletter-note';

  return (
    <section className="ui-section newsletter-section" aria-labelledby="newsletter-title">
      <div className="ui-container">
        <div className="newsletter-section__panel">
          <div className="newsletter-section__content">
            <p className="newsletter-section__eyebrow">Seasonal Notes</p>
            <h2 id="newsletter-title" className="newsletter-section__title">
              把綠意，留在每個季節裡
            </h2>
            <p className="newsletter-section__description">
              不定期收到季節選物、植栽照護筆記與 BetweenGreen 的生活提案。
            </p>
          </div>

          <form className="newsletter-form" noValidate onSubmit={handleSubmit}>
            <label className="newsletter-form__label" htmlFor="newsletter-email">
              電子郵件
            </label>

            <div className="newsletter-form__controls">
              <span className="newsletter-form__input-wrap">
                <Mail aria-hidden="true" />
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="hello@example.com"
                  value={email}
                  aria-invalid={feedback.type === 'error'}
                  aria-describedby={`${noteId} ${feedbackId}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </span>

              <button className="newsletter-form__submit" type="submit">
                確認訂閱信箱
                <ArrowRight aria-hidden="true" />
              </button>
            </div>

            <p id={noteId} className="newsletter-form__note">
              目前為作品展示流程，不會儲存或傳送 Email；正式上線後才會串接訂閱服務與隱私同意。
            </p>

            <div
              id={feedbackId}
              className={`newsletter-form__feedback${
                feedback.type === 'idle' ? '' : ` is-${feedback.type}`
              }`}
              role={feedback.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {feedback.type === 'error' && <AlertCircle aria-hidden="true" />}
              {feedback.type === 'success' && <CheckCircle2 aria-hidden="true" />}
              {feedback.message}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
