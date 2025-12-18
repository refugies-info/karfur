function WhiteWave({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 1440 171"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        filter="url(#drop-shadow)"
        d="M1440 180V59c-436.58 77.754-582.689 41.582-918.044 13.57C237.653 48.823 0 85.01 0 85.01V180"
        fill="#fff"
      />
      <defs>
        <filter id="drop-shadow" x="-50%" y="0%" width="200%" height="200%">
          <feDropShadow dx="0" dy="-4.167" stdDeviation="10.416" floodColor="rgba(0,0,0,0.20)" />
        </filter>
      </defs>
    </svg>
  );
}

WhiteWave.propTypes = {};

export default WhiteWave;
