import { Button } from "./buttons";

// type 1 button
export function BottomButtonsCombo1({
  label,
  disabled = false,
  loading = false,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="w-full min-h-[88px] p-5 bg-white flex items-center">
      <Button
        buttonType="text"
        size="lg"
        styleType="brand"
        className="w-full"
        disabled={disabled}
        loading={loading}
        onClick={onClick}
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
  leftDisabled = false,
  rightDisabled = false,
  leftLoading = false,
  rightLoading = false,
  onLeftClick,
  onRightClick,
}: {
  leftLabel: string;
  rightLabel: string;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  leftLoading?: boolean;
  rightLoading?: boolean;
  onLeftClick?: () => void;
  onRightClick?: () => void;
}) {
  return (
    <div className="w-[315px] min-h-[88px] bg-white flex items-center gap-[12px]">
      <Button
        buttonType="text"
        size="lg"
        styleType="gray"
        className="flex-1"
        disabled={leftDisabled}
        loading={leftLoading}
        onClick={onLeftClick}
      >
        {leftLabel}
      </Button>
      <Button
        buttonType="text"
        size="lg"
        styleType="brand"
        className="flex-1"
        disabled={rightDisabled}
        loading={rightLoading}
        onClick={onRightClick}
      >
        {rightLabel}
      </Button>
    </div>
  );
}

// type 3 buttons
export function BottomButtonsCombo3({
  shareDisabled = false,
  heartDisabled = false,
  label,
  labelDisabled = false,
  shareLoading = false,
  heartLoading = false,
  labelLoading = false,
  onShareClick,
  onHeartClick,
  onLabelClick,
  heartScrapped,
}: {
  shareDisabled?: boolean;
  heartDisabled?: boolean;
  label: string;
  labelDisabled?: boolean;
  shareLoading?: boolean;
  heartLoading?: boolean;
  labelLoading?: boolean;
  onShareClick?: () => void;
  onHeartClick?: () => void;
  onLabelClick?: () => void;
  heartScrapped: boolean;
}) {
  return (
    <div className="w-full min-h-[88px] p-5 bg-white flex items-center gap-3">
      <Button
        buttonType="symbol"
        styleType="gray"
        iconType="share"
        onClick={onShareClick}
        disabled={shareDisabled}
        loading={shareLoading}
      />
      <Button
        buttonType="symbol"
        styleType="gray"
        iconType="heart"
        onClick={onHeartClick}
        disabled={heartDisabled}
        loading={heartLoading}
        heartScrapped={heartScrapped}
      />
      <Button
        buttonType="text"
        size="lg"
        styleType="brand"
        className="w-full"
        onClick={onLabelClick}
        disabled={labelDisabled}
        loading={labelLoading}
      >
        {label}
      </Button>
    </div>
  );
}
