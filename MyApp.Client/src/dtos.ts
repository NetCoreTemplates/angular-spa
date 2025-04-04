/* Options:
Date: 2025-04-03 15:31:38
Version: 8.60
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace: 
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/

// @ts-nocheck

export interface IReturn<T>
{
    createResponse(): T;
}

export interface IReturnVoid
{
    createResponse(): void;
}

export interface IGet
{
}

export interface IHasSessionId
{
    sessionId?: string;
}

export interface IHasBearerToken
{
    bearerToken?: string;
}

export interface IPost
{
}

export interface IPut
{
}

export interface IDelete
{
}

export interface ICreateDb<Table>
{
}

export interface IPatchDb<Table>
{
}

export interface IDeleteDb<Table>
{
}

// @DataContract
export class QueryBase
{
    // @DataMember(Order=1)
    public skip?: number;

    // @DataMember(Order=2)
    public take?: number;

    // @DataMember(Order=3)
    public orderBy: string;

    // @DataMember(Order=4)
    public orderByDesc: string;

    // @DataMember(Order=5)
    public include: string;

    // @DataMember(Order=6)
    public fields: string;

    // @DataMember(Order=7)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<QueryBase>) { (Object as any).assign(this, init); }
}

export class QueryData<T> extends QueryBase
{

    public constructor(init?: Partial<QueryData<T>>) { super(init); (Object as any).assign(this, init); }
}

export class QueryDb<T> extends QueryBase
{

    public constructor(init?: Partial<QueryDb<T>>) { super(init); (Object as any).assign(this, init); }
}

// @DataContract
export class AuditBase
{
    // @DataMember(Order=1)
    public createdDate: string;

    // @DataMember(Order=2)
    // @Required()
    public createdBy: string;

    // @DataMember(Order=3)
    public modifiedDate: string;

    // @DataMember(Order=4)
    // @Required()
    public modifiedBy: string;

    // @DataMember(Order=5)
    public deletedDate?: string;

    // @DataMember(Order=6)
    public deletedBy: string;

    public constructor(init?: Partial<AuditBase>) { (Object as any).assign(this, init); }
}

export enum RoomType
{
    Single = 'Single',
    Double = 'Double',
    Queen = 'Queen',
    Twin = 'Twin',
    Suite = 'Suite',
}

/** @description Discount Coupons */
export class Coupon
{
    public id: string;
    public description: string;
    public discount: number;
    public expiryDate: string;

    public constructor(init?: Partial<Coupon>) { (Object as any).assign(this, init); }
}

/** @description Booking Details */
export class Booking extends AuditBase
{
    public id: number;
    public name: string;
    public roomType: RoomType;
    public roomNumber: number;
    public bookingStartDate: string;
    public bookingEndDate?: string;
    public cost: number;
    // @References("typeof(MyApp.ServiceModel.Coupon)")
    public couponId?: string;

    public discount: Coupon;
    public notes?: string;
    public cancelled?: boolean;

    public constructor(init?: Partial<Booking>) { super(init); (Object as any).assign(this, init); }
}

export class Forecast implements IGet
{
    public date: string;
    public temperatureC: number;
    public summary?: string;
    public temperatureF: number;

    public constructor(init?: Partial<Forecast>) { (Object as any).assign(this, init); }
}

export class PageStats
{
    public label: string;
    public total: number;

    public constructor(init?: Partial<PageStats>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseError
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public fieldName: string;

    // @DataMember(Order=3)
    public message: string;

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseError>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseStatus
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public message: string;

    // @DataMember(Order=3)
    public stackTrace: string;

    // @DataMember(Order=4)
    public errors: ResponseError[];

    // @DataMember(Order=5)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseStatus>) { (Object as any).assign(this, init); }
}

// @DataContract
export class QueryResponse<T>
{
    // @DataMember(Order=1)
    public offset: number;

    // @DataMember(Order=2)
    public total: number;

    // @DataMember(Order=3)
    public results: T[];

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    // @DataMember(Order=5)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<QueryResponse<T>>) { (Object as any).assign(this, init); }
}

export class HelloResponse
{
    public result: string;

    public constructor(init?: Partial<HelloResponse>) { (Object as any).assign(this, init); }
}

export class AdminDataResponse
{
    public pageStats: PageStats[] = [];

    public constructor(init?: Partial<AdminDataResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class RegisterResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public referrerUrl: string;

    // @DataMember(Order=5)
    public bearerToken: string;

    // @DataMember(Order=6)
    public refreshToken: string;

    // @DataMember(Order=7)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=8)
    public roles: string[];

    // @DataMember(Order=9)
    public permissions: string[];

    // @DataMember(Order=10)
    public redirectUrl: string;

    // @DataMember(Order=11)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=12)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<RegisterResponse>) { (Object as any).assign(this, init); }
}

export class Todo
{
    public id: number;
    public text: string;
    public isFinished: boolean;

    public constructor(init?: Partial<Todo>) { (Object as any).assign(this, init); }
}

// @DataContract
export class AuthenticateResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public referrerUrl: string;

    // @DataMember(Order=6)
    public bearerToken: string;

    // @DataMember(Order=7)
    public refreshToken: string;

    // @DataMember(Order=8)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=9)
    public profileUrl: string;

    // @DataMember(Order=10)
    public roles: string[];

    // @DataMember(Order=11)
    public permissions: string[];

    // @DataMember(Order=12)
    public authProvider: string;

    // @DataMember(Order=13)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=14)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<AuthenticateResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class IdResponse
{
    // @DataMember(Order=1)
    public id: string;

    // @DataMember(Order=2)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<IdResponse>) { (Object as any).assign(this, init); }
}

// @Route("/hello/{Name}")
export class Hello implements IReturn<HelloResponse>, IGet
{
    public name: string;

    public constructor(init?: Partial<Hello>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Hello'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new HelloResponse(); }
}

export class GetWeatherForecast implements IReturn<Forecast[]>, IGet
{
    public date?: string;

    public constructor(init?: Partial<GetWeatherForecast>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetWeatherForecast'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Array<Forecast>(); }
}

export class AdminData implements IReturn<AdminDataResponse>, IGet
{

    public constructor(init?: Partial<AdminData>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'AdminData'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new AdminDataResponse(); }
}

/** @description Sign Up */
// @Api(Description="Sign Up")
// @DataContract
export class Register implements IReturn<RegisterResponse>, IPost
{
    // @DataMember(Order=1)
    public userName: string;

    // @DataMember(Order=2)
    public firstName: string;

    // @DataMember(Order=3)
    public lastName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public email: string;

    // @DataMember(Order=6)
    public password: string;

    // @DataMember(Order=7)
    public confirmPassword: string;

    // @DataMember(Order=8)
    public autoLogin?: boolean;

    // @DataMember(Order=10)
    public errorView: string;

    // @DataMember(Order=11)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<Register>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Register'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new RegisterResponse(); }
}

// @Route("/confirm-email")
export class ConfirmEmail implements IReturnVoid, IGet
{
    public userId: string;
    public code: string;
    public returnUrl?: string;

    public constructor(init?: Partial<ConfirmEmail>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'ConfirmEmail'; }
    public getMethod() { return 'GET'; }
    public createResponse() {}
}

// @Route("/todos", "GET")
export class QueryTodos extends QueryData<Todo> implements IReturn<QueryResponse<Todo>>
{
    public id?: number;
    public ids?: number[];
    public textContains?: string;

    public constructor(init?: Partial<QueryTodos>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryTodos'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Todo>(); }
}

// @Route("/todos", "POST")
export class CreateTodo implements IReturn<Todo>, IPost
{
    // @Validate(Validator="NotEmpty")
    public text: string;

    public constructor(init?: Partial<CreateTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateTodo'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Todo(); }
}

// @Route("/todos/{Id}", "PUT")
export class UpdateTodo implements IReturn<Todo>, IPut
{
    public id: number;
    // @Validate(Validator="NotEmpty")
    public text: string;

    public isFinished: boolean;

    public constructor(init?: Partial<UpdateTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateTodo'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Todo(); }
}

// @Route("/todos/{Id}", "DELETE")
export class DeleteTodo implements IReturnVoid, IDelete
{
    public id: number;

    public constructor(init?: Partial<DeleteTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteTodo'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/todos", "DELETE")
export class DeleteTodos implements IReturnVoid, IDelete
{
    public ids: number[] = [];

    public constructor(init?: Partial<DeleteTodos>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteTodos'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Sign In */
// @Route("/auth", "GET,POST")
// @Route("/auth/{provider}", "POST")
// @Api(Description="Sign In")
// @DataContract
export class Authenticate implements IReturn<AuthenticateResponse>, IPost
{
    /** @description AuthProvider, e.g. credentials */
    // @DataMember(Order=1)
    public provider: string;

    // @DataMember(Order=2)
    public userName: string;

    // @DataMember(Order=3)
    public password: string;

    // @DataMember(Order=4)
    public rememberMe?: boolean;

    // @DataMember(Order=5)
    public accessToken: string;

    // @DataMember(Order=6)
    public accessTokenSecret: string;

    // @DataMember(Order=7)
    public returnUrl: string;

    // @DataMember(Order=8)
    public errorView: string;

    // @DataMember(Order=9)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<Authenticate>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Authenticate'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new AuthenticateResponse(); }
}

/** @description Find Bookings */
// @Route("/bookings", "GET")
// @Route("/bookings/{Id}", "GET")
export class QueryBookings extends QueryDb<Booking> implements IReturn<QueryResponse<Booking>>
{
    public id?: number;
    public bookingStartDateAfter?: string;

    public constructor(init?: Partial<QueryBookings>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryBookings'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Booking>(); }
}

/** @description Find Coupons */
// @Route("/coupons", "GET")
export class QueryCoupons extends QueryDb<Coupon> implements IReturn<QueryResponse<Coupon>>
{
    public id?: string;

    public constructor(init?: Partial<QueryCoupons>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryCoupons'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Coupon>(); }
}

/** @description Create a new Booking */
// @Route("/bookings", "POST")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class CreateBooking implements IReturn<IdResponse>, ICreateDb<Booking>
{
    /** @description Name this Booking is for */
    // @Validate(Validator="NotEmpty")
    public name: string;

    public roomType: RoomType;
    // @Validate(Validator="GreaterThan(0)")
    public roomNumber: number;

    // @Validate(Validator="GreaterThan(0)")
    public cost: number;

    // @Required()
    public bookingStartDate: string;

    public bookingEndDate?: string;
    public notes?: string;
    public couponId?: string;

    public constructor(init?: Partial<CreateBooking>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateBooking'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Update an existing Booking */
// @Route("/booking/{Id}", "PATCH")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class UpdateBooking implements IReturn<IdResponse>, IPatchDb<Booking>
{
    public id: number;
    public name?: string;
    public roomType?: RoomType;
    // @Validate(Validator="GreaterThan(0)")
    public roomNumber?: number;

    // @Validate(Validator="GreaterThan(0)")
    public cost?: number;

    public bookingStartDate?: string;
    public bookingEndDate?: string;
    public notes?: string;
    public couponId?: string;
    public cancelled?: boolean;

    public constructor(init?: Partial<UpdateBooking>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateBooking'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a Booking */
// @Route("/booking/{Id}", "DELETE")
// @ValidateRequest(Validator="HasRole(`Manager`)")
export class DeleteBooking implements IReturnVoid, IDeleteDb<Booking>
{
    public id: number;

    public constructor(init?: Partial<DeleteBooking>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteBooking'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/coupons", "POST")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class CreateCoupon implements IReturn<IdResponse>, ICreateDb<Coupon>
{
    // @Validate(Validator="NotEmpty")
    public description: string;

    // @Validate(Validator="GreaterThan(0)")
    public discount: number;

    // @Validate(Validator="NotNull")
    public expiryDate: string;

    public constructor(init?: Partial<CreateCoupon>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateCoupon'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new IdResponse(); }
}

// @Route("/coupons/{Id}", "PATCH")
// @ValidateRequest(Validator="HasRole(`Employee`)")
export class UpdateCoupon implements IReturn<IdResponse>, IPatchDb<Coupon>
{
    public id: string;
    // @Validate(Validator="NotEmpty")
    public description: string;

    // @Validate(Validator="NotNull")
    // @Validate(Validator="GreaterThan(0)")
    public discount: number;

    // @Validate(Validator="NotNull")
    public expiryDate: string;

    public constructor(init?: Partial<UpdateCoupon>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateCoupon'; }
    public getMethod() { return 'PATCH'; }
    public createResponse() { return new IdResponse(); }
}

/** @description Delete a Coupon */
// @Route("/coupons/{Id}", "DELETE")
// @ValidateRequest(Validator="HasRole(`Manager`)")
export class DeleteCoupon implements IReturnVoid, IDeleteDb<Coupon>
{
    public id: string;

    public constructor(init?: Partial<DeleteCoupon>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteCoupon'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

