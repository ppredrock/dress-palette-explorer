export type UserRole = "user" | "admin";
export type DressCategory =
  | "bridal"
  | "party"
  | "casual"
  | "ethnic"
  | "western"
  | "fusion"
  | "other";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";
export type MakeupCategory =
  | "bridal"
  | "party"
  | "editorial"
  | "natural"
  | "special_effects"
  | "other";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";
export type PostCategory =
  | "fashion"
  | "makeup"
  | "skincare"
  | "lifestyle"
  | "travel"
  | "food"
  | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Dress {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  rental_price: number | null;
  category: DressCategory;
  images: string[];
  sizes: string[];
  colors: string[];
  available: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface DressBooking {
  id: string;
  user_id: string;
  dress_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  notes: string | null;
  total_amount: number | null;
  created_at: string;
  updated_at: string;
  dress?: Dress;
  user?: Profile;
}

export interface MakeupService {
  id: string;
  title: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  category: MakeupCategory;
  image_url: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MakeupAppointment {
  id: string;
  user_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  service?: MakeupService;
  user?: Profile;
}

export interface LifestylePost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  tags: string[];
  category: PostCategory;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  subject: string;
  content: string;
  read: boolean;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  user?: Profile;
}

// Supabase Database type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      dresses: {
        Row: Dress;
        Insert: Omit<Dress, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Dress, "id" | "created_at">>;
      };
      dress_bookings: {
        Row: DressBooking;
        Insert: Omit<DressBooking, "id" | "created_at" | "updated_at" | "dress" | "user">;
        Update: Partial<Omit<DressBooking, "id" | "created_at" | "dress" | "user">>;
      };
      makeup_services: {
        Row: MakeupService;
        Insert: Omit<MakeupService, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<MakeupService, "id" | "created_at">>;
      };
      makeup_appointments: {
        Row: MakeupAppointment;
        Insert: Omit<MakeupAppointment, "id" | "created_at" | "updated_at" | "service" | "user">;
        Update: Partial<Omit<MakeupAppointment, "id" | "created_at" | "service" | "user">>;
      };
      lifestyle_posts: {
        Row: LifestylePost;
        Insert: Omit<LifestylePost, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<LifestylePost, "id" | "created_at">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at" | "user">;
        Update: Partial<Omit<Message, "id" | "created_at" | "user">>;
      };
    };
  };
}
