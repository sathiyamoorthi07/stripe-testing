import {
  Document,
  Model,
  Schema,
  model,
  models,
  Types,
  ObjectId,
} from "mongoose";
import mediaFile from "./media-file";

export interface DateOfBirth {
  day: number;
  month: number;
  year: number;
}

export interface UserEmail {
  email_id: string;
  is_primary: boolean;
  is_verified: boolean;
  created_time: number;
}

export interface UserRecoveryPhone {
  number: number;
  type: string;
  is_primary: boolean;
}

export interface UserWebsites {
  category: string;
  url: string;
}
export interface UserLocations {
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  country: string;
  state: string;
  district: string;
  postal_code: string;
  is_permanent: boolean;
  created_at: Date;
}
export interface Usereducations {
  degree_name: string;
  end_month_year: {
    month: number;
    year: number;
  };
  start_month_year: {
    month: number;
    year: number;
  };
  notes: string;
  created_at: Date;
}
export interface UserOrganization {
  name: string;
  description: string;
  end_month_year: {
    month: number;
    year: number;
  };
  start_month_year: {
    month: number;
    year: number;
  };
  position: {
    title: string;
    start_month_year: {
      month: number;
      year: number;
    };
    end_month_year: {
      month: number;
      year: number;
    };
  };
}
export interface ProfileKyc {
  type: string;
  number: string;
  image_front_id: ObjectId;
  image_back_id: ObjectId;
  is_verified: Boolean;
}

interface IProfileInfo extends Document {
  user_account_id: ObjectId;
  user_short_id: String;
  zone_id: ObjectId;
  uidai: String;
  first_name: String;
  last_name: String;
  avatar_id: ObjectId;
  guardians_name: String;
  guardians_type: String;
  date_of_birth: DateOfBirth;
  blood_group: String;
  gender: String;
  email_id: String;
  phone_numbers: [UserRecoveryPhone];
  websites: [UserWebsites];
  locations: [UserLocations];
  is_PwD: boolean;
  relation_with_PwD: String;
  profile_picture: String;
  family_id: String;
  marital_status: String;
  spouse_name: String;
  educations: [Usereducations];
  organizations: [UserOrganization];
  created_at: Date;
  status: String;
  kyc: [ProfileKyc];
  decline_reason: {
    message: String;
    user_id: ObjectId;
  };
  customer_id: string;
  subscription_id: string;
}

type ProfileModel = Model<IProfileInfo>;

const ProfileInfoSchema = new Schema<IProfileInfo, ProfileModel>({
  user_account_id: { type: Types.ObjectId },
  user_short_id: { type: String },
  zone_id: { type: Types.ObjectId },
  uidai: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  avatar_id: { type: Types.ObjectId },
  guardians_name: { type: String },
  guardians_type: {
    type: String,
    enum: ["NONE", "FATHER", "HUSBAND", "MOTHER", "OTHER"],
    default: "NONE",
  },
  date_of_birth: {
    type: Schema.Types.Mixed,
    default: null,
  },
  // date_of_birth: {
  //   day: {
  //     type: Number,
  //     default: null,
  //   },
  //   month: {
  //     type: Number,
  //     default: null,
  //   },
  //   year: {
  //     type: Number,
  //     default: null,
  //   },
  // },
  blood_group: {
    type: String,
    enum: ["NONE", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
    default: "NONE",
  },
  gender: {
    type: String,
    enum: ["NONE", "FEMALE", "MALE", "OTHER"],
    default: "NONE",
  },
  email_id: { type: String },
  phone_numbers: [
    {
      number: {
        type: String,
      },
      type: {
        type: String,
        enum: ["WORK", "HOME", "MOBILE", "FAX", "PAGER", "OTHER"],
      },
      is_primary: {
        type: Boolean,
        default: true,
      },
    },
  ],
  websites: [
    {
      category: {
        type: String,
        enum: ["PERSONAL", "COMPANY", "BLOG", "RSS", "PORTFOLIO", "OTHER"],
      },
      url: {
        type: String,
      },
    },
  ],
  locations: [
    {
      address_line_1: { type: String },
      address_line_2: { type: String },
      address_line_3: { type: String },
      country: { type: String },
      state: { type: String },
      district: { type: String },
      postal_code: { type: String },
      is_permanent: {
        type: Boolean,
        default: true,
      },
      created_at: { type: Schema.Types.Date, default: new Date() },
    },
  ],
  is_PwD: {
    type: Boolean,
    default: false,
  },
  relation_with_PwD: {
    type: String,
    enum: [
      "NONE",
      "HUSBAND",
      "WIFE",
      "FATHER",
      "MOTHER",
      "UNCLE",
      "AUNTY",
      "SISTER",
      "DAUGHTER",
      "SELF",
      "SON",
      "OTHER",
    ],
    default: "NONE",
  },
  profile_picture: { type: String },
  family_id: { type: String },
  marital_status: {
    type: String,
    enum: ["NONE", "SINGLE", "MARRIED", "DIVORCED", "WIDOWED"],
    default: "NONE",
  },
  spouse_name: { type: String },
  educations: [
    {
      degree_name: { type: String },
      start_month_year: {
        month: {
          type: Number,
        },
        year: {
          type: Number,
        },
      },
      end_month_year: {
        type: Schema.Types.Mixed,
        default: null,
      },
      notes: { type: String },
      created_at: { type: Schema.Types.Date, default: new Date() },
    },
  ],
  organizations: [
    {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      end_month_year: {
        type: Schema.Types.Mixed,
        default: null,
      },
      start_month_year: {
        month: {
          type: Number,
        },
        year: {
          type: Number,
        },
      },
      position: {
        title: {
          type: String,
        },
        start_month_year: {
          month: {
            type: Number,
          },
          year: {
            type: Number,
          },
        },
        end_month_year: {
          type: Schema.Types.Mixed,
          default: null,
        },
      },
    },
  ],
  status: { type: String, default: "PENDING" },
  decline_reason: {
    type: Schema.Types.Mixed,
    default: null,
  },
  // decline_reson: {
  //   message: { type: String, default: null },
  //   user_id: { type: Schema.Types.ObjectId, default: null },
  // },

  customer_id: { type: String },
  subscription_id: { type: String },

  created_at: { type: Schema.Types.Date, default: new Date() },
  kyc: [
    {
      type: {
        type: String,
      },
      number: {
        type: String,
      },
      image_front_id: {
        type: Schema.Types.ObjectId,
      },
      image_back_id: {
        type: Schema.Types.ObjectId,
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

ProfileInfoSchema.set("toObject", { virtuals: true });
ProfileInfoSchema.set("toJSON", { virtuals: true });

ProfileInfoSchema.virtual("avatar", {
  ref: mediaFile,
  localField: "avatar_id",
  foreignField: "_id",
  justOne: true,
});

export default models.profile_info || model("profile_info", ProfileInfoSchema);
