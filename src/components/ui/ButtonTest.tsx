import { Button } from "./buttons";

export default function ButtonTestPage() {
  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      <div>
        <Button styleType="brand" state="enabled" size="lg">
          레이블
        </Button>
        <Button styleType="brand" state="hovered" size="lg">
          레이블
        </Button>
        <Button styleType="brand" state="focused" size="lg">
          레이블
        </Button>
        <Button styleType="brand" state="disabled" size="lg">
          레이블
        </Button>
        <Button styleType="brand" state="loading" size="lg">
          레이블
        </Button>
      </div>
      <div>
        <Button styleType="gray" state="enabled" size="md">
          레이블
        </Button>
        <Button styleType="gray" state="hovered" size="md">
          레이블
        </Button>
        <Button styleType="gray" state="focused" size="md">
          레이블
        </Button>
        <Button styleType="gray" state="disabled" size="md">
          레이블
        </Button>
        <Button styleType="gray" state="loading" size="md">
          레이블
        </Button>
      </div>
      <div>
        <Button styleType="destructive" state="enabled" size="md">
          레이블
        </Button>
        <Button styleType="destructive" state="hovered" size="md">
          레이블
        </Button>
        <Button styleType="destructive" state="focused" size="md">
          레이블
        </Button>
        <Button styleType="destructive" state="disabled" size="md">
          레이블
        </Button>
        <Button styleType="destructive" state="loading" size="md">
          레이블
        </Button>
        <Button styleType="destructive" state="loading" size="lg">
          레이블
        </Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button buttonType="symbol" styleType="gray" state="enabled">
          <span className="material-icons">share</span>
        </Button>
        <Button buttonType="symbol" styleType="gray" state="hovered">
          <span className="material-icons">share</span>
        </Button>
        <Button buttonType="symbol" styleType="gray" state="focused">
          <span className="material-icons">share</span>
        </Button>
        <Button buttonType="symbol" styleType="gray" state="disabled">
          <span className="material-icons">share</span>
        </Button>
        <Button buttonType="symbol" styleType="gray" state="loading">
          <span className="material-icons">share</span>
        </Button>
      </div>
    </div>
  );
}
