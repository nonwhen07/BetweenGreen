import { BookOpen, PackageCheck, ReceiptText } from 'lucide-react';

const trustItems = [
  {
    id: 'product-details',
    icon: <PackageCheck />,
    title: '商品資訊透明',
    description: '清楚標示分類、售價與販售單位，讓每次選擇都有一致依據。',
  },
  {
    id: 'plant-care',
    icon: <BookOpen />,
    title: '照護內容陪伴',
    description: '從日照、澆水到換盆知識，陪新手循序建立自己的照護節奏。',
  },
  {
    id: 'checkout-summary',
    icon: <ReceiptText />,
    title: '結帳明細清楚',
    description: '購物車同步呈現商品、折扣與金額變化，確認內容後再進入結帳。',
  },
];

const TrustSection = () => {
  return (
    <section className="trust-strip" aria-labelledby="trust-strip-title">
      <div className="ui-container trust-strip__inner">
        <header className="trust-strip__intro">
          <p className="trust-strip__eyebrow">BetweenGreen Promise</p>
          <h2 id="trust-strip-title" className="trust-strip__title">
            把選物資訊說清楚
          </h2>
        </header>

        <ul className="trust-strip__list">
          {trustItems.map(({ id, icon, title, description }) => (
            <li key={id} className="trust-strip__item">
              <span className="trust-strip__icon" aria-hidden="true">
                {icon}
              </span>

              <div>
                <h3 className="trust-strip__item-title">{title}</h3>
                <p className="trust-strip__description">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustSection;
