import React from "react";
import { SignCustomization } from "@/lib/types";

interface SignPreviewProps {
  signCustomization: SignCustomization;
}

const SignPreview: React.FC<SignPreviewProps> = ({ signCustomization }) => {
  const {
    text = "",
    backgroundColor = "black",
    textColor = "black",
    hobbies = [],
  } = signCustomization || {};

  // Background is always white for now
  const getBackgroundColor = () => "bg-white";

  const getMessageColor = () => {
    switch (textColor) {
      case "black":
        return "text-black";
      case "white":
        return "text-white";
      case "blue":
        return "text-blue-500";
      case "red":
        return "text-red-500";
      default:
        return "text-black";
    }
  };

  const getNameColor = () => {
    switch (backgroundColor) {
      case "black":
        return "text-black";
      case "blue":
        return "text-blue-500";
      case "red":
        return "text-red-500";
      default:
        return "text-black";
    }
  };

  const renderGridContent = () => {
    if (!text) {
      return (
        <div className="grid grid-cols-5 gap-1">
          <div></div>
          {"YOUR MESSAGE HERE".split("").map((char, i) => (
            <div
              key={i}
              className={`text-center font-semibold ${getMessageColor()}`}
              style={{ fontSize: "1.5rem" }}
            >
              {char}
            </div>
          ))}
          <div></div>
        </div>
      );
    }

    const lines = text.split("\n");
    const messageLine = lines[0] || "";
    const nameLine = lines[1] || "";

    // Check if message has a number with a suffix
    const suffixMatch = messageLine.match(/([0-9]+)([a-zA-Z]+)(\s|$)/);

    let messageChars = [];
    let gridColumns = 0;

    let beforeSuffix = "";
    let number = "";
    let suffix = "";
    let afterSuffix = "";

    // Remove spaces from the message line
    const messageLineNoSpaces = messageLine.replace(/\s+/g, "");

    if (suffixMatch) {
      // Handle message with number and suffix
      const [fullMatch, number, suffix, ...rest] = suffixMatch;
      const fullMatchNoSpaces = fullMatch.replace(/\s+/g, "");
      beforeSuffix = messageLineNoSpaces.substring(
        0,
        messageLineNoSpaces.indexOf(fullMatchNoSpaces),
      );
      afterSuffix = messageLineNoSpaces.substring(
        messageLineNoSpaces.indexOf(fullMatchNoSpaces) +
          number.length +
          suffix.length,
      );

      // Create array of characters for the message
      messageChars = [
        ...beforeSuffix.toUpperCase().split(""),
        ...number.split(""),
        suffix.toUpperCase(), // Suffix as one unit
        ...afterSuffix.toUpperCase().split(""),
      ];
    } else {
      // Regular message without suffix
      messageChars = messageLineNoSpaces.toUpperCase().split("");
    }

    // Calculate grid columns: message length + 4 (for empty first and last columns)
    gridColumns = messageChars.length + 4;

    // Create array of characters for the name (with spaces removed)
    const nameChars = nameLine.replace(/\s+/g, "").toUpperCase().split("");

    // Calculate how many empty cells needed before name to center it
    const emptyBeforeName = Math.floor((gridColumns - nameChars.length) / 2);
    const emptyAfterName = gridColumns - nameChars.length - emptyBeforeName;

    // Create array for name row with empty cells for centering
    const nameRow = [
      ...Array(emptyBeforeName).fill(""),
      ...nameChars,
      ...Array(emptyAfterName).fill(""),
    ];

    // Calculate number of circles needed on each side
    const totalAvailableSpace = gridColumns - nameChars.length;
    const circlesPerSide = Math.floor(totalAvailableSpace / 4); // Divide by 4 to get circles per side (each circle spans ~2 columns)

    // Create arrays for purple circles on each side
    const leftCircles = Array(circlesPerSide).fill("circle");
    const rightCircles = Array(circlesPerSide).fill("circle");

    // Calculate font size based on grid columns
    // More columns means smaller font size
    const calculateFontSize = () => {
      if (gridColumns <= 10) return "1.5rem";
      if (gridColumns <= 15) return "1.25rem";
      if (gridColumns <= 20) return "1rem";
      if (gridColumns <= 25) return "0.875rem";
      if (gridColumns <= 30) return "0.75rem";
      return "0.625rem";
    };

    const fontSize = calculateFontSize();
    const cellHeight =
      gridColumns <= 15 ? "2rem" : gridColumns <= 25 ? "1.75rem" : "1.5rem";

    return (
      <div
        className="relative w-full"
        style={{
          height: `calc(${cellHeight} * 2 + 0.25rem)`,
        }}
      >
        {/* Green rectangles */}
        <div
          className="absolute bg-green-500 bg-opacity-30 z-0"
          style={{
            top: 0,
            bottom: 0,
            left: `${((0 * 2 + 1) / gridColumns) * 100 - 50 / gridColumns}%`,
            width: `${(1.5 / gridColumns) * 100}%`,
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="absolute bg-green-500 bg-opacity-30 z-0"
          style={{
            top: 0,
            bottom: 0,
            left: `${((gridColumns - 1) / gridColumns) * 100 + 50 / gridColumns}%`,
            width: `${(1.5 / gridColumns) * 100}%`,
            transform: "translateX(-50%)",
          }}
        />
        {/* Message row */}
        <div
          className="absolute top-0 left-0 right-0 grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            width: "100%",
          }}
        >
          <div></div> {/* Empty first column */}
          <div></div> {/* Empty first column */}
          {messageChars.map((char, i) => (
            <div
              key={`msg-${i}`}
              className={`text-center font-semibold ${getMessageColor()} flex items-center justify-center relative z-10`}
              style={{
                width: "100%",
                height: cellHeight,
                fontSize: fontSize,
              }}
            >
              {typeof char === "string" &&
              char.match(/^[a-zA-Z]+$/) &&
              suffixMatch !== null &&
              i === beforeSuffix.length + number.length ? (
                <span
                  className="flex items-end h-full pb-0"
                  style={{
                    fontSize: `calc(${fontSize} * 0.6)`,
                    lineHeight: "1",
                  }}
                >
                  {char}
                </span>
              ) : (
                char
              )}
            </div>
          ))}
          <div></div> {/* Empty last column */}
        </div>

        {/* Name row centered */}
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-end justify-center"
          style={{ height: cellHeight }}
        >
          {nameChars.map((char, i) => (
            <div
              key={`name-${i}`}
              className={`text-center font-semibold ${getNameColor()} flex items-end justify-center`}
              style={{
                width: `calc(100vw / ${gridColumns * 2})`,
                height: cellHeight,
                fontSize: fontSize,
                maxWidth: fontSize,
              }}
            >
              {char}
            </div>
          ))}
        </div>

        {/* Left purple circles */}
        {leftCircles.map((_, i) => {
          const position = ((i * 2 + 1) / gridColumns) * 100;
          return (
            <div
              key={`left-circle-${i}`}
              className="absolute bottom-0 flex items-end justify-center"
              style={{
                left: `${position}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="rounded-full bg-purple-500"
                style={{ width: "2rem", height: "2rem" }}
              ></div>
            </div>
          );
        })}

        {/* Right purple circles */}
        {rightCircles.map((_, i) => {
          const position = ((gridColumns - 1 - i * 2) / gridColumns) * 100;
          return (
            <div
              key={`right-circle-${i}`}
              className="absolute bottom-0 flex items-end justify-center"
              style={{
                left: `${position}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="rounded-full bg-purple-500"
                style={{ width: "2rem", height: "2rem" }}
              ></div>
            </div>
          );
        })}

        {/* Left blue squares */}
        {[...Array(leftCircles.length + 1)].map((_, i) => {
          // Calculate position based on circle positions
          // For first square, position at the starting edge of first circle
          // For middle squares, position at the meeting point of two circles
          // For last square, position at the ending edge of last circle
          let position;
          if (i === 0) {
            // First square - at starting edge of first circle
            position = ((0 * 2 + 1) / gridColumns) * 100 - 50 / gridColumns;
          } else if (i === leftCircles.length) {
            // Last square - at ending edge of last circle
            position =
              (((leftCircles.length - 1) * 2 + 1) / gridColumns) * 100 +
              50 / gridColumns;
          } else {
            // Middle squares - at meeting point between circles
            const prevCirclePos = (((i - 1) * 2 + 1) / gridColumns) * 100;
            const nextCirclePos = ((i * 2 + 1) / gridColumns) * 100;
            position = (prevCirclePos + nextCirclePos) / 2;
          }

          return (
            <div
              key={`left-square-${i}`}
              className="absolute bottom-0 flex items-end justify-center z-20"
              style={{
                left: `${position}%`,
                transform:
                  i === 0
                    ? "translateX(-100%)"
                    : i === leftCircles.length
                      ? "translateX(0%)"
                      : "translateX(-50%)",
              }}
            >
              <div
                className="bg-blue-500"
                style={{ width: "0.875rem", height: "0.875rem" }}
              ></div>
            </div>
          );
        })}

        {/* Right blue squares */}
        {[...Array(rightCircles.length + 1)].map((_, i) => {
          // Calculate position based on circle positions
          let position;
          if (i === 0) {
            // First square - at starting edge of first circle
            position =
              ((gridColumns - 1) / gridColumns) * 100 + 50 / gridColumns;
          } else if (i === rightCircles.length) {
            // Last square - at ending edge of last circle
            position =
              ((gridColumns - 1 - (rightCircles.length - 1) * 2) /
                gridColumns) *
                100 -
              50 / gridColumns;
          } else {
            // Middle squares - at meeting point between circles
            const prevCirclePos =
              ((gridColumns - 1 - (i - 1) * 2) / gridColumns) * 100;
            const nextCirclePos =
              ((gridColumns - 1 - i * 2) / gridColumns) * 100;
            position = (prevCirclePos + nextCirclePos) / 2;
          }

          return (
            <div
              key={`right-square-${i}`}
              className="absolute bottom-0 flex items-end justify-center z-20"
              style={{
                left: `${position}%`,
                transform:
                  i === 0
                    ? "translateX(0%)"
                    : i === rightCircles.length
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
              }}
            >
              <div
                className="bg-blue-500"
                style={{ width: "0.875rem", height: "0.875rem" }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
      <h3 className="text-lg font-medium mb-4">Sign Preview</h3>
      <div className="flex justify-center">
        <div className="w-full max-w-md aspect-[3/2] bg-white border-2 border-gray-300 rounded-md flex items-center justify-center p-4 shadow-md">
          <div className="w-full">
            {renderGridContent()}

            {hobbies && hobbies.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {hobbies.map((hobby) => (
                  <div
                    key={hobby}
                    className="inline-flex items-center justify-center h-8 px-2 text-xs font-medium rounded-full bg-opacity-80"
                    style={{
                      backgroundColor:
                        hobby === "Police/Fire"
                          ? "#1e40af"
                          : hobby === "Sports"
                            ? "#047857"
                            : hobby === "Music"
                              ? "#7c3aed"
                              : hobby === "Art"
                                ? "#db2777"
                                : "#6b7280",
                      color: "white",
                    }}
                  >
                    {hobby}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>This is a preview of how your sign will look.</p>
      </div>
    </div>
  );
};

export default SignPreview;
