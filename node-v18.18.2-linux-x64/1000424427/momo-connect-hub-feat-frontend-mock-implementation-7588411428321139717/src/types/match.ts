export interface Team {
  id: string;
  name: string;
  logo_url?: string;
}

export interface Competition {
  id: string;
  name: string;
  logo_url?: string;
}

export interface Match {
  id: string;
  home_team: Team;
  away_team: Team;
  competition: Competition;
  start_time: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  result?: {
    home_score: number;
    away_score: number;
  };
  odds?: {
    home_win: number;
    draw: number;
    away_win: number;
  };
}
