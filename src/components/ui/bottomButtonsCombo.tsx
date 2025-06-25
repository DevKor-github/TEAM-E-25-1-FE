import { Button } from "./buttons";

// type 1 button
export function BottomButtonsCombo1({
  label,
  state = "enabled", // 기본 state: enabled
}: {
  label: string;
  state?: "enabled" | "hovered" | "focused" | "disabled" | "loading";
}) {
  return (
    <div className="w-full min-h-[88px] p-5 bg-white flex items-center">
      <Button
        buttonType="text"
        size="lg"
        styleType="brand"
        state={state}
        className="w-full"
      >
        {label}
      </Button>
    </div>
  );
}

// type 2 buttons
export function BottomButtonsCombo2({
  leftLabel,
  rightLabel,
  leftState = "enabled",
  rightState = "enabled",
}: {
  leftLabel: string;
  rightLabel: string;
  leftState?: "enabled" | "hovered" | "focused" | "disabled" | "loading";
  rightState?: "enabled" | "hovered" | "focused" | "disabled" | "loading";
}) {
  return (
    <div className="w-full min-h-[88px] p-5 bg-white flex items-center gap-3">
      <Button
        buttonType="text"
        size="lg"
        styleType="gray"
        state={leftState}
        className="w-[161.5px]"
      >
        {leftLabel}
      </Button>
      <Button
        buttonType="text"
        size="lg"
        styleType="brand"
        state={rightState}
        className="w-[161.5px]"
      >
        {rightLabel}
      </Button>
    </div>
  );
}

// type 3 buttons
export function BottomButtonsCombo3({
  shareState = "enabled",
  heartState = "enabled",
  label,
  labelState = "enabled",
}: {
  shareState?: "enabled" | "hovered" | "focused" | "disabled" | "loading";
  heartState?: "enabled" | "hovered" | "focused" | "disabled" | "loading";
  label: string;
  labelState?: "enabled" | "hovered" | "focused" | "disabled" | "loading";
}) {
  return (
    <div className="w-full min-h-[88px] p-5 bg-white flex items-center gap-3">
      <Button
        buttonType="symbol"
        styleType="gray"
        state={shareState}
        iconType="share"
      ></Button>
      <Button
        buttonType="symbol"
        styleType="gray"
        state={heartState}
        iconType="heart"
      ></Button>
      <Button
        buttonType="text"
        size="lg"
        styleType="brand"
        state={labelState}
        className="w-[215px]"
      >
        {label}
      </Button>
    </div>
  );
}
