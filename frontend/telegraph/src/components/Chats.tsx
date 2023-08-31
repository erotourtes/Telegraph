import { useEffect, useState } from "react";
import AvaliableChats from "./AvaliableChats";
import CreateChat from "./CreateChatForm";
import { ChatI } from "../interfaces";
import ChatContainer from "./ChatContainer";
import { BASE_URL } from "@/constants";
import { useAuth } from "./Auth/AuthContext";
import { useHeight } from "./Hooks/useHeight";
import { chats as styles } from "./Styles/object.ts";
import { usePrevious } from "./Hooks/usePrevious.ts";

const fetchLogout = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/user/logout`, {
    credentials: "include",
    method: "POST",
  });

  return await response.json();
};

const getIndicatorProps = (
  containerHeightRef: React.RefObject<HTMLDivElement>
) => {
  const htmlElement = containerHeightRef.current?.childNodes[1] as
    | HTMLDivElement
    | undefined;

  const indicatorHeight = htmlElement?.offsetHeight;
  const indicatorMargin =
    htmlElement &&
    window.getComputedStyle(htmlElement).margin.replace("px", "");

  return {
    indicatorHeight: indicatorHeight || 0,
    indicatorMargin: parseInt(indicatorMargin || "0"),
  };
};

function Chats() {
  const [chatId, setChatId] = useState<number>(0);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatI[]>([]);
  const [isHiddenButtons, setIsHiddenButtons] = useState<boolean>(false);
  const { user, setIsLoggedIn } = useAuth();
  const { ref: containerHeightRef } = useHeight();
  const curChatPositionInLine = chats.findIndex(
    (chat) => chat.chat_id == chatId
  );

  const { indicatorHeight, indicatorMargin } =
    getIndicatorProps(containerHeightRef);

  const prevPos =
    usePrevious<number>(
      curChatPositionInLine * (indicatorHeight + indicatorMargin)
    ) || 0;
  const curPos = curChatPositionInLine * (indicatorHeight + indicatorMargin);

  useEffect(() => {
    const indicator = containerHeightRef.current?.childNodes[0] as
      | HTMLDivElement
      | undefined;
    if (!indicator) return;

    const intermediate = prevPos + (curPos - prevPos) / 3;

    console.log(prevPos, intermediate, curPos);

    const newspaperSpinning = [
      { transform: `scaleY(1) translateY(${prevPos}px)` },
      { transform: `scaleY(1.25) translateY(${intermediate}px)` },
      {
        transform: `scaleY(1) translateY(${curPos}px)`,
      },
    ];

    const newspaperTiming = {
      duration: 1300,
      iterations: 1,
      easing: "ease-in-out",
      fill: "forwards",
    };

    indicator.style.transformOrigin = curPos < prevPos ? "bottom" : "top";

    indicator.animate(
      newspaperSpinning,
      newspaperTiming as KeyframeAnimationOptions
    );
  }, [chatId]);

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h1
          style={styles.text as React.CSSProperties}
          onClick={() => setIsHiddenButtons(!isHiddenButtons)}
        >{`${user?.username} ${isHiddenButtons ? "🠶" : "🠷"}`}</h1>

        <div
          style={
            isHiddenButtons
              ? styles.hidden
              : (styles.buttons as React.CSSProperties)
          }
        >
          <button
            style={styles.button}
            onClick={() =>
              fetchLogout().then((data) => setIsLoggedIn(!data.success))
            }
          >
            Logout
          </button>

          <button
            style={styles.button}
            onClick={() => setIsCreateMode(!isCreateMode)}
          >
            {!isCreateMode ? "Create new chat" : "Cancel"}
          </button>
          {isCreateMode && (
            <CreateChat
              setCreatedChat={(value: ChatI) => setChats([...chats, value])}
              setIsCreatingMode={(value: boolean) => setIsCreateMode(value)}
            />
          )}
        </div>

        <div
          // key={chatId} // for rerender
          ref={containerHeightRef}
          style={{ position: "relative" }}
        >
          {chatId !== 0 && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "3px",
                width: "4px",
                height: `${indicatorHeight}px`,
                borderRadius: "10px",
                // transition: "transform 0.3s ease-in-out",
                // transform: `translateY(${
                //   curChatPositionInLine * (indicatorHeight + indicatorMargin)
                // }px)`,
                backgroundColor: "orange",
              }}
            ></div>
          )}
          <AvaliableChats
            setChatId={setChatId}
            curChatId={chatId}
            chats={chats}
            setChats={(value: ChatI[]) => setChats(value)}
          />
        </div>
      </div>

      <div style={styles.right as React.CSSProperties}>
        <ChatContainer chatId={chatId} />
      </div>
    </div>
  );
}

export default Chats;
