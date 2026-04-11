// import poinsettia from '@/assets/poinsettia.svg';

const PoinsettiaIcon = () => {
  return (
    <div className="icon">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="plant-group"
          stroke="#000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <g id="leaf-group">
            <path d="M100 70 C110 60, 130 60, 120 80 C130 90, 110 100, 100 85 C90 100, 70 90, 80 80 C70 60, 90 60, 100 70 Z"></path>
            <path d="M100 90 C115 80, 140 85, 120 105 C135 115, 110 120, 100 105 C90 120, 65 115, 80 105 C60 85, 85 80, 100 90 Z"></path>
          </g>
          <g id="flower-center">
            <circle cx="100" cy="85" r="3"></circle>
          </g>
          <g id="pot">
            <path d="M80 120 L120 120 L115 150 Q100 160 85 150 Z"></path>
          </g>
          <g id="ribbon">
            <path d="M95 135 C85 130, 85 145, 95 140"></path>
            <path d="M105 135 C115 130, 115 145, 105 140"></path>
            <circle cx="100" cy="138" r="2"></circle>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PoinsettiaIcon;
