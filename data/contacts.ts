import type { ContactItem } from "@/types/content";

export const contactItems: ContactItem[] = [
  {
    id: "beginner-enquiry",
    type: "beginner",
    label: "Beginner enquiry",
    description:
      "For parents, juniors and adults who want to understand how to start karting.",
    email: "to confirm",
    formSubject: "Beginner enquiry",
    responseNote: "Response time to confirm.",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm beginner contact",
        detail: "Add approved email routing for beginner enquiries.",
        priority: "high",
      },
    ],
  },
  {
    id: "membership-enquiry",
    type: "membership",
    label: "Membership enquiry",
    description:
      "Questions about joining KartSport Auckland Mt Wellington, membership categories and fees.",
    email: "to confirm",
    formSubject: "Membership enquiry",
    responseNote: "Response time to confirm.",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm membership contact",
        detail: "Add approved email routing for membership enquiries.",
        priority: "high",
      },
    ],
  },
  {
    id: "practice-enquiry",
    type: "practice",
    label: "Practice enquiry",
    description:
      "Questions about practice days, track access, visitor practice and sign-in process.",
    email: "to confirm",
    formSubject: "Practice enquiry",
    responseNote: "Response time to confirm.",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm practice contact",
        detail: "Add approved email routing for practice enquiries.",
        priority: "high",
      },
    ],
  },
  {
    id: "race-entries-enquiry",
    type: "race-entry",
    label: "Race entries enquiry",
    description:
      "Questions about entering club days, entry deadlines, fees and transponders.",
    email: "to confirm",
    formSubject: "Race entries enquiry",
    responseNote: "Response time to confirm.",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm race entries contact",
        detail: "Add approved email routing for race entry enquiries.",
        priority: "high",
      },
    ],
  },
  {
    id: "sponsorship-enquiry",
    type: "sponsorship",
    label: "Sponsorship enquiry",
    description:
      "For businesses interested in sponsoring KartSport Auckland Mt Wellington.",
    email: "to confirm",
    formSubject: "Sponsorship enquiry",
    responseNote: "Response time to confirm.",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm sponsorship contact",
        detail: "Add approved email routing for sponsorship enquiries.",
        priority: "medium",
      },
    ],
  },
  {
    id: "volunteering-enquiry",
    type: "volunteering",
    label: "Volunteering enquiry",
    description:
      "For people interested in volunteering or becoming an official at club events.",
    email: "to confirm",
    formSubject: "Volunteering enquiry",
    responseNote: "Response time to confirm.",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm volunteering contact",
        detail: "Add approved email routing for volunteer and official enquiries.",
        priority: "medium",
      },
    ],
  },
  {
    id: "general-enquiry",
    type: "general",
    label: "General enquiry",
    description:
      "For general questions about the club, venue, website or anything not covered above.",
    email: "to confirm",
    formSubject: "General enquiry",
    responseNote: "Response time to confirm.",
    status: "to-confirm",
    todos: [
      {
        label: "Confirm general contact",
        detail: "Add approved general club email address.",
        priority: "high",
      },
    ],
  },
];
