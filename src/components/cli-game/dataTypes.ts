// Shared interface for decision content
export interface ContentDecision {
    id: string;
    context: string;
    ["choice-end"]: string;
    ["choice-success"]: string;
    ["choice-end-title"]?: string;
    ["choice-end-outcome"]?: string;
    ["choice-success-title"]?: string;
    ["choice-success-outcome"]?: string;
  }
  
  // News article shown in the terminal
  export interface NewsItem {
    headline: string;
    summary: string;
    decisionTrigger?: string; // optional trigger for a game decision
  }
  
  // A post in the LAN feed
  export interface LANItem {
    title: string;
    author: string;
    content: string; // post content
    decisionTrigger?: string;
  }
  
  // Content shown for each year
  export interface GameContentItem {
    year: number;
    news?: NewsItem[];
    notebook?: string[];
    calendar?: string;
    lan_posts?: LANItem[];
    workstation?: string;
  }
  