import dayjs from "dayjs";
export const contractObj = {
    ID:'00000000-0000-0000-0000-000000000000',
    ContractNumber: "",
    ContractDate: dayjs(new Date()).format("MM/DD/YYYY"),
    MaturityDate: dayjs(
      new Date().setDate(new Date().getDate() + parseInt(7))
    ).format("MM/DD/YYYY"),
    OptionId: "",
    CommodityId: "",
    CommodityClassId: "",
    Symbol: "",
    ECXWarehouseId: "",
    TraderWarehouse: "",
    ProductionYear: "",
    QuantityInLot: "",
    QuantityNetWeight: "",
    Price: "",
    Attachement: {},
    BuyerMargin:0,
    SellerMargin:0
  };
  export const trader = {
    ID:'00000000-0000-0000-0000-000000000000',
    MemberId: "",
    MemberName: "",
    ClientId: "",
    ClientName: "",
    TINNumber: "",
    VATNumber: "",
    Region: "",
    Zone: "",
    Woreda: "",
    HouseNo: "",
    Phone: "",
    IsSeller: true,
    IsSelf: false,
  };
  export const contractDTO = {
    contract: contractObj,
    buyer: { ...trader, IsSeller: false },
    seller: trader
  };