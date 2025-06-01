import { Button } from "@/components/ui/buttons";

export default function ButtonTest() {
  return (
    <div className="flex flex-col gap-10 p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-row gap-6">
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
      <div className="flex flex-row gap-6">
        <Button styleType="gray" state="enabled" size="lg">
          레이블
        </Button>
        <Button styleType="gray" state="hovered" size="lg">
          레이블
        </Button>
        <Button styleType="gray" state="focused" size="lg">
          레이블
        </Button>
        <Button styleType="gray" state="disabled" size="lg">
          레이블
        </Button>
        <Button styleType="gray" state="loading" size="lg">
          레이블
        </Button>
      </div>
      <div className="flex flex-row gap-6">
        <Button styleType="destructive" state="enabled" size="lg">
          레이블
        </Button>
        <Button styleType="destructive" state="hovered" size="lg">
          레이블
        </Button>
        <Button styleType="destructive" state="focused" size="lg">
          레이블
        </Button>
        <Button styleType="destructive" state="disabled" size="lg">
          레이블
        </Button>
        <Button styleType="destructive" state="loading" size="lg">
          레이블
        </Button>
      </div>
      <div className="flex flex-row gap-6">
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
      <div className="flex flex-row gap-6">
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
      </div>
      <div className="flex flex-row gap-6">
        <Button
          buttonType="symbol"
          styleType="gray"
          state="enabled"
          iconType="share"
        ></Button>
        <Button
          buttonType="symbol"
          styleType="gray"
          state="hovered"
          iconType="share"
        ></Button>
        <Button
          buttonType="symbol"
          styleType="gray"
          state="focused"
          iconType="share"
        ></Button>
        <Button
          buttonType="symbol"
          styleType="gray"
          state="disabled"
          iconType="share"
        ></Button>
        <Button
          buttonType="symbol"
          styleType="gray"
          state="loading"
          iconType="share"
        ></Button>
      </div>
    </div>
  );
}
