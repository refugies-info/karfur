/* eslint-disable no-use-before-define */
type BookmarkProps = {
  variant?: "add" | "fill" | "line";
  className?: string;
  size?: string;
};

export function Bookmark({ variant = "line", className, size = "1.5em" }: BookmarkProps) {
  // siwtch variants
  switch (variant) {
    case "add":
      return addVariant({ className, size });
    case "fill":
      return fillVariant({ className, size });
    case "line":
      return lineVariant({ className, size });
    default:
      return null;
  }
}

function addVariant({ className, size }: BookmarkProps) {
  return (
    <svg
      width={size}
      className={className}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 2V5H20V7H16.999L17 10H15L14.999 7H12V5H15V2H17Z" fill="#000091" />
      <path
        d="M19.5 22.6434C19.7761 22.6434 20 22.4194 20 22.1433V11H18V19.4324L12 15.6707L6 19.4324V4H12V2H5C4.44772 2 4 2.44772 4 3V22.1433C4 22.2373 4.02647 22.3293 4.07637 22.4089C4.22306 22.6429 4.53163 22.7136 4.76559 22.5669L12 18L19.2344 22.5669C19.314 22.6168 19.4061 22.6434 19.5 22.6434Z"
        fill="#000091"
      />
    </svg>
  );
}

function fillVariant({ className, size }: BookmarkProps) {
  return (
    <svg
      width={size}
      className={className}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 2H19C19.5523 2 20 2.44772 20 3V22.143C20.0002 22.3251 19.9015 22.4929 19.7421 22.5811C19.5828 22.6693 19.3882 22.6639 19.234 22.567L12 18.03L4.766 22.566C4.61197 22.6628 4.41754 22.6683 4.2583 22.5803C4.09905 22.4924 4 22.3249 4 22.143V3C4 2.44772 4.44772 2 5 2Z"
        fill="#000091"
      />
    </svg>
  );
}

function lineVariant({ className, size }: BookmarkProps) {
  return (
    <svg
      width={size}
      className={className}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 2C19.5523 2 20 2.44772 20 3V22.143C20.0002 22.3251 19.9015 22.4929 19.7421 22.5811C19.5828 22.6693 19.3882 22.6639 19.234 22.567L12 18.03L4.766 22.566C4.61197 22.6628 4.41754 22.6683 4.2583 22.5803C4.09905 22.4924 4 22.3249 4 22.143V3C4 2.44772 4.44772 2 5 2H19ZM18 4H6V19.432L12 15.671L18 19.432V4Z"
        fill="#000091"
      />
    </svg>
  );
}
