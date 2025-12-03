// Complete declarative AutoQuery services for Bookings CRUD example:
// https://docs.servicestack.net/autoquery-crud-bookings

using System;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using ServiceStack;
using ServiceStack.DataAnnotations;
using MyApp;

namespace MyApp.ServiceModel;

[Tag("Bookings")]
[AutoApply(Behavior.AuditQuery)]
[ValidateHasRole("Employee")]
public class QueryBookings : QueryDb<Booking>
{
    public int? Id { get; set; }
    public List<int>? Ids { get; set; }
}

[Tag("Bookings")]
[AutoApply(Behavior.AuditCreate)]
[ValidateHasRole("Employee")]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse>
{
    [ValidateNotEmpty]
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    [ValidateGreaterThan(0)]
    public int RoomNumber { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }
    [ValidateGreaterThan(0)]
    public decimal Cost { get; set; }
    [Input(Type="textarea")]
    public string? Notes { get; set; }
    public bool? Cancelled { get; set; }
}

[Tag("Bookings")]
[AutoApply(Behavior.AuditModify)]
[ValidateHasRole("Employee")]
public class UpdateBooking : IPatchDb<Booking>, IReturn<IdResponse>
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public RoomType? RoomType { get; set; }
    [ValidateGreaterThan(0)]
    public int? RoomNumber { get; set; }
    public DateTime? BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }
    [ValidateGreaterThan(0)]
    public decimal? Cost { get; set; }
    [Input(Type="textarea")]
    public string? Notes { get; set; }
    public bool? Cancelled { get; set; }
}

[Tag("Bookings")]
[AutoApply(Behavior.AuditSoftDelete)]
[ValidateHasRole("Manager")]
[ValidateHasRole("Employee")]
public class DeleteBooking : IDeleteDb<Booking>, IReturnVoid
{
    public int? Id { get; set; }
    public List<int>? Ids { get; set; }
}


[Icon(Svg="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='currentColor' d='M16 10H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1zm3-7h-1V2c0-.55-.45-1-1-1s-1 .45-1 1v1H8V2c0-.55-.45-1-1-1s-1 .45-1 1v1H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V8h14v10c0 .55-.45 1-1 1zm-5-5H8c-.55 0-1 .45-1 1s.45 1 1 1h5c.55 0 1-.45 1-1s-.45-1-1-1z'/></svg>")]
[Notes("Captures a Persons Name & Room Booking information")]
[Description("Booking Details")]
public class Booking : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    public int RoomNumber { get; set; }
    [IntlDateTime(DateStyle.Long)]
    public DateTime BookingStartDate { get; set; }
    [IntlRelativeTime]
    public DateTime? BookingEndDate { get; set; }
    [IntlNumber(Currency="USD")]
    public decimal Cost { get; set; }
    public string? Notes { get; set; }
    public bool? Cancelled { get; set; }
    [Format(FormatMethods.Hidden)]
    [Reference(SelfId=nameof(CreatedBy),RefId=nameof(User.UserName),RefLabel=nameof(User.DisplayName))]
    public User Employee { get; set; }
}


public enum RoomType
{
    Single,
    Double,
    Queen,
    Twin,
    Suite,
}

