import { AxiosRequestConfig, AxiosPromise } from "axios";
import { RefetchOptions } from "axios-hooks";
import { IconType } from "react-icons";
import { ButtonProps, SxProps, Theme } from "@mui/material";

export interface ChatMessage {
  username: string;
  message: string;
  time: string;
  avatar: string;
  nickname: string;
  locale: string;
  islocal: boolean;
  message_id: string;
}

export interface Profile {
  nickname: string;
  avatar: string;
  username: string;
  province: number;
  military_education: number;
  economic_education: number;
  political_education: number;
  partyid: string;
  citizenship: number;
  date_of_citizenship: string;
  damage_bonus_province: number | null;
}

export interface UserData {
  username: string;
  gold: number;
  oil: number;
  gas: number;
  interstellardobra: number;
  iron: number;
  riffles: number;
  ammo: number;
  grenades: number;
  can_fight_from: string;
}

export interface StudyData {
  finish_time: string;
  field_of_study: string;
}

export interface Party {
  partyid: string;
  party_name: string;
  leader_username: string;
  province: number;
  max_members: number;
  current_members: number;
  invitation_only: boolean;
  logo: string;
}

export interface UserDataContextType {
  profile: Profile;
  userData: UserData;
  refetchUserData: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<any>;
  refetchProfile: (
    config?: AxiosRequestConfig<any> | undefined,
    options?: RefetchOptions | undefined
  ) => AxiosPromise<Profile>;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface SignupForm extends LoginForm {
  email: string;
  hcaptcha: string;
}

export interface Mine {
  mine_name: string;
  owner_username: string;
  max_workers: number;
  profit_multiplier: number;
  owner_profit_share: number;
  building_id: string;
  province: number;
  current_workers: number;
}

export interface Workplace {
  username: string;
  building_id: string;
  start_time: string;
  building_type: string;
  workplace_id: string;
}

export interface Market {
  asset: number;
  cash: number;
  balance: number;
  asset_name: string;
}

export interface CreatePartyResponse {
  partyID: string;
}

export interface State {
  state_name: string;
  political_system: string;
  stateid: string;
  creation_date: string;
  coat_of_arms: string;
  provinces: number[];
  leader: string | null;
  members_of_parliament: string[] | null;
  color: string;
}

export interface Law {
  law_id: string;
  stateid: string;
  proposer: string;
  law: string;
  voting_end: string;
  voted_no: string[] | null;
  voted_yes: string[] | null;
  voted_abstain: string[] | null;
  not_voted: string[];
}

export interface Election {
  stateid: string;
  voting_start: string;
  voting_end: string;
  partyid: string[];
  vote_count: number[] | null;
  users_who_voted: string[] | null;
}

export interface Province {
  province_name: string;
  oil: number;
  gas: number;
  gold: number;
  climate: string;
  province_number: number;
  iron: number;
  borders: number[] | null;
}

export interface Article {
  username: string;
  article: string;
  articleid: string;
  nickname: string;
  locale: string;
  islocal: boolean;
  title: string;
  time: string;
  upvotes: number;
}

export interface War {
  attackers_stateid: string;
  score: number;
  disputed_province: number;
  war_end: string;
  defenders_stateid: string;
  war_id: string;
  attacking_province: number;
}

export interface WarDetails extends War {
  attackersStateName?: string;
  defendersStateName?: string;
}

export interface ButtonWithtooltipProps extends ButtonProps {
  arrow?: boolean;
}

export interface LinkProperties {
  url: string;
  text: string;
}

export interface StorageProps {
  name: AssetName;
  Icon: IconType;
  description?: string;
  isWeapon: boolean;
  children?: React.ReactNode;
  unit?: string;
}

export interface ApiCall {
  params: string;
  authorization?: string;
  data?: any;
  method:
    | "post"
    | "get"
    | "delete"
    | "request"
    | "head"
    | "options"
    | "put"
    | "patch"
    | "postForm"
    | "putForm"
    | "patchForm";
}

export interface RequestConfig extends ApiCall {
  auth: string;
}

export interface UpvoteData {
  timestamp: string;
  upvote: boolean;
  username: string;
  upvoteid: string;
  articleid: string;
}

export type AssetName =
  | "riffles"
  | "ammo"
  | "grenades"
  | "oil"
  | "gold"
  | "gas"
  | "iron";

export type BuildingType =
  | "gold_mines"
  | "oil_fields"
  | "gas_plants"
  | "iron_mines";
