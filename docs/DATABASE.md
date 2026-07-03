# Database Design

## Sheet: Providers

| Column | Description |
|---------|-------------|
| ID | Unique ID |
| Name | Provider Name |
| Service | Speech, OT, ABA, etc. |
| Locality | Area |
| Address | Address |
| Phone | Contact Number |
| WhatsApp | WhatsApp Number |
| Google Maps | Maps Link |
| Website | Website |
| Verified | Yes / No |
| Featured | Yes / No |
| Notes | Admin Notes |

---

## Sheet: Recommendations

Stores provider recommendations submitted by parents.

| Column | Description |
|---------|-------------|
| Timestamp | Submission Time |
| Provider Name | Provider |
| Service | Service |
| Locality | Area |
| Parent Comments | Recommendation |

---

## Sheet: Feedback

Stores user feedback.

| Column | Description |
|---------|-------------|
| Timestamp | Submission Time |
| Rating | Rating |
| Feedback | Message |