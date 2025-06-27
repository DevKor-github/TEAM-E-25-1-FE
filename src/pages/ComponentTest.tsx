import { useState } from "react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import ToggleButton from "@/components/ui/ToggleButton";
import AllToggleButton from "@/components/ui/AllToggleButton";
import EventImage from "@/components/ui/EventImage";
import EventTypeIndicator from "@/components/ui/EventTypeIndicator";
import EventDateIndicator from "@/components/ui/EventDateIndicator";
import EventCard from "@/components/ui/EventCard";
import EventThumbnail from "@/components/ui/EventThumbnail";

function ComponentTest() {
  const [selected2, setSelected2] = useState("레이블1");
  const [selected3, setSelected3] = useState("레이블2");
  const [selected4, setSelected4] = useState("레이블3");

  const [categories, setCategories] = useState({
    festival: false,
    briefing: false
  });

  const handleAllToggle = (checked: boolean) => {
    setCategories({
      festival: checked,
      briefing: checked
    });
  };

  const handleCategoryToggle = (category: keyof typeof categories) => (checked: boolean) => {
    setCategories(prev => ({
      ...prev,
      [category]: checked
    }));
  };

  return (
    <div className="p-10 space-y-10 bg-white min-h-screen">
      <h1 className="text-xl font-bold">UI 컴포넌트 데모</h1>

      {/* 🔹 Segmented Control */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Segmented Control</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-sm text-gray-600 mb-2">2개 세그먼트</h3>
            <SegmentedControl 
              segments={["레이블1", "레이블2"]} 
              selected={selected2} 
              onChange={setSelected2} 
            />
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2">3개 세그먼트</h3>
            <SegmentedControl 
              segments={["레이블1", "레이블2", "레이블3"]} 
              selected={selected3} 
              onChange={setSelected3} 
            />
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2">4개 세그먼트</h3>
            <SegmentedControl 
              segments={["레이블1", "레이블2", "레이블3", "레이블4"]} 
              selected={selected4} 
              onChange={setSelected4} 
            />
          </div>
        </div>
      </div>

      {/* 🔹 Toggle Buttons */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Toggle Buttons</h2>
        <div className="space-y-4">
          <AllToggleButton
            label="모두 선택하기"
            defaultToggled={Object.values(categories).every(v => v)}
            onChange={handleAllToggle}
          />
          <div className="flex gap-4">
            <ToggleButton 
              label="축제" 
              defaultToggled={categories.festival}
              onChange={handleCategoryToggle('festival')}
            />
            <ToggleButton 
              label="설명회" 
              defaultToggled={categories.briefing}
              onChange={handleCategoryToggle('briefing')}
            />
          </div>
        </div>
      </div>

      {/* 🔹 Event Type Indicator */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Event Type Indicator</h2>
        <div className="flex gap-4">
          <EventTypeIndicator type="강연" />
          <EventTypeIndicator type="공모전" />
          <EventTypeIndicator type="대회" />
          <EventTypeIndicator type="박람회" />
          <EventTypeIndicator type="설명회" />
          <EventTypeIndicator type="축제" />
        </div>
      </div>

      {/* 🔹 Event Date Indicator */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Event Date Indicator</h2>
        <div className="flex gap-4">
          <EventDateIndicator dday={117} status="upcoming" />
          <EventDateIndicator dday={7} status="imminent" />
          <EventDateIndicator dday={3} status="imminent" />
          <EventDateIndicator dday={1} status="imminent" />
          <EventDateIndicator status="ongoing" />
          <EventDateIndicator status="ended" />
        </div>
      </div>

      {/* 🔹 Event Image */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Event Image</h2>
        <div className="grid grid-cols-3 gap-4">
          <EventImage src="" alt="이미지 없음" />
        </div>
      </div>

      {/* 🔹 Event Card & Thumbnail */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Event Card & Thumbnail</h2>
        <section>
          <h2 className="font-bold text-lg mb-2">Event Card</h2>
          <div className="rounded-2xl">
            <EventCard
              title="이벤트 타이틀"
              date="9월 25일 (수)"
              type="강연"
              dday={117}
              isLiked={true}
              likeCount={1000}
              imageUrl={"/assets/event_thumbnail_image.png"}
            />
            <EventCard
              title="이벤트 타이틀"
              date="9월 25일 (수)"
              type="강연"
              dday={117}
              isLiked={false}
              likeCount={1000}
              imageUrl={"/assets/event_thumbnail_image.png"}

            />
          </div>
        </section>
        <section>
          <h2 className="font-bold text-lg mb-2">Event Thumbnail</h2>
          <EventThumbnail
            title="이벤트 타이틀"
            org="dcamp officehour"
            imageUrl={"/assets/event_thumbnail_image.png"}
            period="25.04.24.(목) ~ 25.05.15.(목)"
            location="온라인 접수"
          />
        </section>
      </div>
    </div>
  );
}

export default ComponentTest;