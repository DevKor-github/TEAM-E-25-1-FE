import TabbedControl from "@/components/ui/tabbedControl";

export default function TabbedControlTest() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <TabbedControl
          tabs={[
            { label: "탭 이름", id: "tab1" },
            { label: "탭 이름", id: "tab2" },
            { label: "탭 이름", id: "tab3" },
            { label: "탭 이름", id: "tab4" },
          ]}
        />
      </div>

      <div>
        <TabbedControl
          tabs={[
            { label: "탭 이름", id: "tab1" },
            { label: "탭 이름", id: "tab2" },
            { label: "탭 이름", id: "tab3" },
          ]}
        />
      </div>

      <div>
        <TabbedControl
          tabs={[
            { label: "탭 이름", id: "tab1", numbering: 0 },
            { label: "탭 이름", id: "tab2", numbering: 12 },
            { label: "탭 이름", id: "tab3", numbering: "999+" },
          ]}
        />
      </div>

      <div>
        <TabbedControl tabs={[{ label: "탭 이름", id: "tab1" }]} />
      </div>

      <div>
        <TabbedControl
          tabs={[{ label: "탭 이름", id: "tab1", numbering: "999+" }]}
        />
      </div>
    </div>
  );
}
