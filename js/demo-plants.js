window.DEMO_PLANTS = {
  title: "On-site operations assistant",
  threads: [
    {
      id: "trip",
      label: "Line 3 trip",
      messages: [
        { role: "user", text: "Line 3 tripped on the filler overnight. What does the last shift report say?" },
        {
          role: "assistant",
          text: "The 29 September shift report says the filler stopped at 02:14 on a downstream photoeye. The note says the sensor was wiped and the line restarted at 02:41. Work order 18442 is still open for a replacement photoeye.",
          sources: ["Shift report, 29 Sep, Line 3", "Work order 18442", "SOP-FILL-12"]
        }
      ]
    },
    {
      id: "bearing",
      label: "Bearing spec",
      messages: [
        { role: "user", text: "What bearing is on the Line 3 conveyor drive?" },
        {
          role: "assistant",
          text: "The vendor manual for the gearmotor lists bearing 6208-2RS on the drive end. The preventive-maintenance sheet names the same part, last replaced in March 2025.",
          sources: ["Vendor manual, drive section", "PM sheet, Line 3 drive", "Asset list DRV-3"]
        }
      ]
    },
    {
      id: "pm",
      label: "PM vs manual",
      messages: [
        { role: "user", text: "The PM says grease monthly. The manual says every 2,000 hours. Which one do we follow?" },
        {
          role: "assistant",
          text: "The vendor manual interval is 2,000 hours. After the 2024 failure on this asset, the plant PM shortened that to monthly. On this site the PM is the standard. The manual is the vendor baseline.",
          sources: ["PM-DRV-3", "Vendor manual, lubrication", "Failure note, Nov 2024"]
        }
      ]
    },
    {
      id: "wall",
      label: "Line 7 wall",
      blocked: true,
      messages: [
        { role: "user", text: "Pull the Line 7 CIP setpoints." },
        {
          role: "assistant",
          blocked: true,
          text: "Your sign-in is a Line 3 technician. Line 7 records are outside that role, so nothing from Line 7 was retrieved."
        }
      ]
    }
  ]
};
