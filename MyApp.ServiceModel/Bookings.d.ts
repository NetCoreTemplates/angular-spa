/// <reference path="./api.d.ts" />
export type Config = {
  prompt:    "New Booking"
  api:       "~/MyApp.ServiceModel/Bookings.cs"
  migration: "~/MyApp/Migrations/Migration1000.cs"
  tip:       "Remove Bookings Feature: npx okai rm Bookings.d.ts",
}

export enum RoomType {
  Single,
  Double,
  Queen,
  Twin,
  Suite,
}

@Delete.validateHasRole("Manager")
@tag("Bookings")
@icon({svg:"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M16 10H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm3-7h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H8V2c0-.55-.45-1-1-1s-1 .45-1 1v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V8h14v10c0 .55-.45 1-1 1zm-5-5H8c-.55 0-1 .45-1 1s.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1z'/></svg>"})
@notes("Captures a Persons Name & Room Booking information")
@description("Booking Details")
@validateHasRole("Employee")
export class Booking extends AuditBase {
  @autoIncrement()
  id: number
  @Create.description("Name this Booking is for")
  @validateNotEmpty()
  name: string
  roomType: RoomType
  @validateGreaterThan(0)
  roomNumber: number
  @intlDateTime(DateStyle.Long)
  bookingStartDate: Date
  @intlRelativeTime()
  bookingEndDate?: Date
  @intlNumber({currency:"USD"})
  @validateGreaterThan(0)
  cost: decimal
  @input({type:"textarea"})
  notes?: string
  cancelled?: boolean
  @reference({selfId:"nameof(CreatedBy)",refId:"nameof(User.UserName)",refLabel:"nameof(User.DisplayName)"})
  employee: User
}
