import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SegmentedControl from "./SegmentedControl";
import { describe, it, expect, vi, beforeEach } from 'vitest';


describe("SegmentedControl", () => {
  const segments = ["All", "Upcoming", "Past"];
  const selected = "Upcoming";
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
    render(
      <SegmentedControl
        segments={segments}
        selected={selected}
        onChange={onChange}
      />
    );
  });

  it("모든 segment 버튼이 올바르게 렌더링된다", () => {
    segments.forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("선택된 segment만 강조 스타일(class, font-bold 등)이 적용된다", () => {
    segments.forEach((label) => {
      const btn = screen.getByRole("button", { name: label });
      if (label === selected) {
        expect(btn).toHaveClass("font-bold");
        expect(btn).toHaveClass("bg-[var(--Grays-White)]");
      } else {
        expect(btn).toHaveClass("font-normal");
        expect(btn).toHaveClass("bg-transparent");
      }
    });
  });

  it("segment 버튼 클릭 시 onChange가 해당 label로 호출된다", () => {
    const btn = screen.getByRole("button", { name: "Past" });
    fireEvent.click(btn);
    expect(onChange).toHaveBeenCalledWith("Past");
  });

  it("같은 segment를 클릭해도 onChange가 호출된다", () => {
    const btn = screen.getByRole("button", { name: selected });
    fireEvent.click(btn);
    expect(onChange).toHaveBeenCalledWith(selected);
  });

  it("segment가 1개일 때도 정상 렌더링되고 클릭 동작한다", () => {
    onChange.mockClear();
    render(
      <SegmentedControl
        segments={["OnlyOne"]}
        selected={"OnlyOne"}
        onChange={onChange}
      />
    );
    const btn = screen.getByRole("button", { name: "OnlyOne" });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onChange).toHaveBeenCalledWith("OnlyOne");
  });
});
