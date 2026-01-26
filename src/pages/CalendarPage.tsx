import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderFrame from "@/components/HeaderFrame";
import EventCard from "@/components/ui/EventCard";
import { Button } from "@/components/ui/buttons";
import { api } from "@/lib/axios";
import { useScrapSyncStore } from "@/stores/scrapSyncStore";
import CalendarGridRow from "@/components/ui/CalendarGridRow";
import CalendarMargin from "@/components/ui/CalendarMargin";
import { CalendarItemEventCount } from "@/components/ui/CalendarItem";
import CalendarMonthSheet from "@/components/CalendarMonthSheet";
import triangleIcon from "@/assets/triangleIcon.svg";
import emptyFileIcon from "@/assets/emptyFileIcon.svg";

export type Article = {
  id: string;
  title: string;
  organization: string;
  thumbnailPath: string;
  scrapCount: number;
  viewCount: number;
  tags: string[];
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationStartAt?: string;
  registrationEndAt?: string;
  imagePaths: string[];
  registrationUrl: string;
  isScrapped?: boolean;
};

export default function CalendarPage() {
  const navigate = useNavigate();
  const fetchingRef = useRef(false);

  const [articleList, setArticleList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const scrapUpdates = useScrapSyncStore((state) => state.updates);
  const setScrapStatus = useScrapSyncStore((state) => state.setScrapStatus);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const [calendarMonthSheetOpen, setCalendarMonthSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 현재 년/월로 캘린더 기본 년/월 설정
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);

  const handleMonthSelect = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDate(null); // 년/월 변경 시 선택 초기화
  };

  const handleDateClick = (date: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return; // 현재 월이 아니면 클릭 무시
    setSelectedDate(date);
  };

  const handleBackToCalendar = () => {
    // 스크랩 삭제된 행사 articleList에서 제거
    setArticleList((prev) => prev.filter((a) => a.isScrapped !== false));
    setSelectedDate(null);
  };

  // 날짜별 행사 목록 가져오는 함수 (모든 달의 날짜에 대해)
  const getArticlesForDate = (
    year: number,
    month: number,
    dateStr: string,
  ): Article[] => {
    const targetDate = new Date(year, month - 1, parseInt(dateStr));
    targetDate.setHours(0, 0, 0, 0);

    return articleList.filter((article) => {
      const startDate = new Date(article.startAt);
      const endDate = new Date(article.endAt);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return targetDate >= startDate && targetDate <= endDate;
    });
  };

  // 날짜별 행사 개수 계산하는 함수
  const getEventCountForDate = (
    year: number,
    month: number,
    dateStr: string,
  ): CalendarItemEventCount => {
    const eventsOnDate = getArticlesForDate(year, month, dateStr);
    const count = eventsOnDate.length;

    if (count === 0) return "None";
    if (count === 1) return "1";
    if (count === 2) return "2";
    if (count === 3) return "3";
    return "4+";
  };

  // 선택된 날짜의 행사 목록 가져오기
  const getArticlesForSelectedDate = (): Article[] => {
    if (!selectedDate || !selectedWeek) return [];

    // 선택된 날짜가 속한 주에서 해당 날짜 정보 찾기
    const selectedDayData = selectedWeek.find(
      (day) => day.date === selectedDate,
    );
    if (!selectedDayData) return [];

    return selectedDayData.articles;
  };

  // 달력 데이터 생성 함수
  const generateCalendarData = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0);

    const firstDayOfWeek = firstDay.getDay(); // 0 (일) ~ 6 (토)
    const lastDate = lastDay.getDate();
    const prevMonthLastDate = prevMonthLastDay.getDate();

    const calendarDays: Array<{
      date: string;
      state: "Enabled" | "Deactivated";
      isCurrentMonth: boolean;
      eventCount: CalendarItemEventCount;
      articles: Article[];
      year: number;
      month: number;
    }> = [];

    // 이전 달 년/월 계산
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    // 다음 달 년/월 계산
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    // 이전 달 날짜들
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dateStr = String(prevMonthLastDate - i);
      const articles = getArticlesForDate(prevYear, prevMonth, dateStr);
      calendarDays.push({
        date: dateStr,
        state: "Deactivated",
        isCurrentMonth: false,
        eventCount: getEventCountForDate(prevYear, prevMonth, dateStr),
        articles: articles,
        year: prevYear,
        month: prevMonth,
      });
    }

    // 현재 달 날짜들
    for (let date = 1; date <= lastDate; date++) {
      const dateStr = String(date);
      const articles = getArticlesForDate(currentYear, currentMonth, dateStr);
      calendarDays.push({
        date: dateStr,
        state: "Enabled",
        isCurrentMonth: true,
        eventCount: getEventCountForDate(currentYear, currentMonth, dateStr),
        articles: articles,
        year: currentYear,
        month: currentMonth,
      });
    }

    // 다음 달 날짜들
    const remainingDays = 42 - calendarDays.length;
    for (let date = 1; date <= remainingDays; date++) {
      const dateStr = String(date);
      const articles = getArticlesForDate(nextYear, nextMonth, dateStr);
      calendarDays.push({
        date: dateStr,
        state: "Deactivated",
        isCurrentMonth: false,
        eventCount: getEventCountForDate(nextYear, nextMonth, dateStr),
        articles: articles,
        year: nextYear,
        month: nextMonth,
      });
    }

    // 7일씩 6주로 나누기
    const weeks: (typeof calendarDays)[] = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
    }

    return weeks;
  };

  const calendarWeeks = generateCalendarData();

  // 선택된 날짜가 속한 주 찾기
  const selectedWeek = selectedDate
    ? calendarWeeks.find((week) =>
        week.some((day) => day.date === selectedDate && day.isCurrentMonth),
      )
    : null;

  const selectedDateArticles = getArticlesForSelectedDate();

  // 스크랩 목록 조회 API
  const fetchScrapedArticles = useCallback(async () => {
    if (fetchingRef.current) {
      return;
    }

    fetchingRef.current = true;

    try {
      setLoading(true);

      const apiParams = {
        isFinished: true,
        // sortBy: "registrationStartAt",
        page: 1,
        limit: 10,
      };
      const response = await api.get("/scrap", { params: apiParams });

      const scrapList = Array.isArray(response.data) ? response.data : [];

      if (scrapList.length === 0) {
        setArticleList([]);
        return;
      }

      const articlesWithScrapStatus = scrapList.map((article) => ({
        ...article,
        id: article.articleId,
        isScrapped: true,
      }));

      const overrides = useScrapSyncStore.getState().updates;
      const articlesWithOverrides = articlesWithScrapStatus.map(
        (article: Article) => {
          const override = overrides[article.id];
          if (!override) {
            return article;
          }
          return {
            ...article,
            isScrapped: override.isScrapped,
            scrapCount:
              typeof override.scrapCount === "number"
                ? override.scrapCount
                : article.scrapCount,
          };
        },
      );

      setArticleList(articlesWithOverrides);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      } else {
        alert("스크랩한 게시글 목록을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [navigate]);

  // API: 스크랩 토글
  const handleToggleScrap = async (id: string) => {
    const article = articleList.find((a) => a.id === id);
    if (!article) return;

    const previousScrapStatus = article.isScrapped ?? false;
    const previousScrapCount = article.scrapCount;
    const newScrapStatus = !previousScrapStatus;
    const newScrapCount = previousScrapStatus
      ? previousScrapCount - 1
      : previousScrapCount + 1;

    try {
      setArticleList((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, isScrapped: newScrapStatus, scrapCount: newScrapCount }
            : a,
        ),
      );

      if (previousScrapStatus) {
        await api.delete(`/scrap/${id}`);
      } else {
        await api.post(`/scrap/${id}`);
      }

      setScrapStatus({
        articleId: id,
        isScrapped: newScrapStatus,
        scrapCount: Math.max(0, newScrapCount),
      });
    } catch (error: any) {
      setArticleList((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                isScrapped: !a.isScrapped,
                scrapCount: a.isScrapped ? a.scrapCount + 1 : a.scrapCount - 1,
              }
            : a,
        ),
      );

      setScrapStatus({
        articleId: id,
        isScrapped: previousScrapStatus,
        scrapCount: previousScrapCount,
      });

      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 404) {
        alert("해당 게시글이 존재하지 않습니다.");
      } else if (error.response?.status === 409) {
        alert("이미 스크랩한 게시글입니다.");
      } else {
        alert("스크랩 처리 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    fetchScrapedArticles();
  }, [fetchScrapedArticles]);

  useEffect(() => {
    setArticleList((prev) =>
      prev.length === 0
        ? prev
        : prev.map((article) => {
            const override = scrapUpdates[article.id];
            if (!override) {
              return article;
            }

            return {
              ...article,
              isScrapped: override.isScrapped,
              scrapCount:
                typeof override.scrapCount === "number"
                  ? override.scrapCount
                  : article.scrapCount,
            };
          }),
    );
  }, [scrapUpdates]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100">
        <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
          <HeaderFrame />
          <div className="flex flex-col items-center px-5">
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-gray-500">로딩 중...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 바깥 프레임
    <div className="w-full min-h-screen bg-gray-100">
      {/* 중앙 컨텐츠 프레임 */}
      <div className="w-full max-w-[460px] mx-auto bg-white min-h-screen">
        <HeaderFrame />

        <div className="flex flex-col w-full border-b border-gray-100 pt-5 pb-3 gap-4">
          <div className="flex w-full px-5 gap-2.5">
            <div className="gap-1 font-semibold text-title3 text-gray-800 font-pretendard">
              {currentYear}년 {currentMonth}월
            </div>
            <img
              src={triangleIcon}
              width={24}
              height={24}
              alt="triangle icon"
              className="cursor-pointer"
              onClick={() => setCalendarMonthSheetOpen(true)}
            />
          </div>

          <div className="flex w-full">
            <CalendarMargin className="h-[18px] flex-[0.03_0_0]" />
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="flex-1 min-w-0 px-[2px] gap-2.5 text-center font-medium text-tiny2 text-gray-700 font-pretendard"
              >
                {day}
              </div>
            ))}
            <CalendarMargin className="h-[18px] flex-[0.03_0_0]" />
          </div>
        </div>

        <div className="flex flex-col w-full overflow-y-auto">
          {selectedDate && selectedWeek ? (
            // 특정 날짜가 선택되면 해당 주만 표시
            <CalendarGridRow
              weekData={selectedWeek}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              currentYear={currentYear}
              currentMonth={currentMonth}
              isFullCalendarView={false}
            />
          ) : (
            // 특정 날짜가 선택되지 않으면 전체 캘린더 표시
            calendarWeeks.map((week, weekIndex) => (
              <CalendarGridRow
                key={weekIndex}
                weekData={week}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
                currentYear={currentYear}
                currentMonth={currentMonth}
                isFullCalendarView={true}
              />
            ))
          )}
        </div>

        {selectedDate && (
          <>
            <div className="flex w-full gap-5 px-5 pt-8 pb-2 items-center justify-between">
              <div className="w-full text-title4 font-semibold text-gray-800 font-pretendard">
                {currentMonth}월 {selectedDate}일 행사
              </div>
              <Button
                styleType="gray"
                size="md"
                className="min-w-fit whitespace-nowrap text-body2 text-gray-700"
                onClick={handleBackToCalendar}
              >
                캘린더로 돌아가기
              </Button>
            </div>

            <div className="mt-3 flex flex-col px-5">
              <div className="flex flex-col gap-4 w-full items-center">
                {selectedDateArticles.length === 0 ? (
                  <div className="flex flex-col w-full gap-3 items-center px-5 py-10">
                    <img
                      src={emptyFileIcon}
                      alt="search-result-empty"
                      className="w-10 h-10"
                    />
                    <div className="text-center text-body2 text-gray-500 font-pretendard">
                      {currentMonth}월 {selectedDate}일에는 행사가 없어요.
                      <br />
                      다른 날짜를 선택해주세요.
                    </div>
                  </div>
                ) : (
                  selectedDateArticles.map((article) => (
                    <EventCard
                      key={article.id}
                      {...article}
                      isScrapped={article.isScrapped !== false} // 동적으로 처리, 기본값은 true
                      onCardClick={() => navigate(`/event/${article.id}`)}
                      onToggleScrap={() => handleToggleScrap(article.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {!selectedDate && (
          <div className="pt-5 pb-12 font-semibold text-title4 text-gray-800 font-pretendard text-center">
            날짜를 탭하고 <br />
            행사를 찾아보세요
          </div>
        )}

        {calendarMonthSheetOpen && (
          <CalendarMonthSheet
            open={calendarMonthSheetOpen}
            onClose={() => setCalendarMonthSheetOpen(false)}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onSelect={handleMonthSelect}
          />
        )}
      </div>
    </div>
  );
}
