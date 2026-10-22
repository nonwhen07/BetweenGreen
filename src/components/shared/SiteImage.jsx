import { useState } from 'react';

const SiteImageSource = ({ asset, alt, ...props }) => {
  const [useFallback, setUseFallback] = useState(false);
  const primarySrc = asset.src || asset.fallbackSrc;
  const imageSrc = useFallback ? asset.fallbackSrc : primarySrc;

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => {
        // 本地圖也失敗時不重設 src，避免重複請求與錯誤迴圈。
        if (!useFallback && asset.fallbackSrc && asset.fallbackSrc !== primarySrc) {
          setUseFallback(true);
        }
      }}
    />
  );
};

const SiteImage = ({ asset, alt = '', ...props }) => (
  <SiteImageSource
    key={`${asset.src || ''}|${asset.fallbackSrc || ''}`}
    asset={asset}
    alt={alt}
    {...props}
  />
);

export default SiteImage;
