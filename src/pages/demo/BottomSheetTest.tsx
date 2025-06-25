import BottomSheet from "@/components/ui/bottomSheet";
import {
  BottomButtonsCombo1,
  BottomButtonsCombo2,
  BottomButtonsCombo3,
} from "@components/ui/bottomButtonsCombo";

export default function BottomSheetTest() {
  return (
    <div>
      <BottomSheet
        title="바텀시트 타이틀입니다"
        description="바텀시트 디스크립션입니다. 두 줄 이내로 요약적으로 작성하면 좋아요."
      ></BottomSheet>

      <BottomSheet
        title="바텀시트 타이틀입니다"
        description="바텀시트 디스크립션입니다. 두 줄 이내로 요약적으로 작성하면 좋아요."
      >
        <BottomButtonsCombo1 label="레이블" />
      </BottomSheet>

      <BottomSheet
        title="바텀시트 타이틀입니다"
        description="바텀시트 디스크립션입니다. 두 줄 이내로 요약적으로 작성하면 좋아요."
      >
        <BottomButtonsCombo2 leftLabel="레이블" rightLabel="레이블" />
      </BottomSheet>

      <BottomSheet
        title="바텀시트 타이틀입니다"
        description="바텀시트 디스크립션입니다. 두 줄 이내로 요약적으로 작성하면 좋아요."
      >
        <BottomButtonsCombo3
          shareState="enabled"
          heartState="enabled"
          label="레이블"
          labelState="enabled"
        />
      </BottomSheet>
    </div>
  );
}
