import { ActiwebDataCheckpoint, CheckpointDataActiweb } from "../../models/checkpoints/actiweb-checkpoint";
import { convertDate, formatDateYYYYMMDD } from "../../../shared/utils/datetime";

export function actiwebToCheckpoint(form: any): ActiwebDataCheckpoint {
    return {
      structuredNotes: {
        structuredNotesStrategiesCp   : form['structuralStrategies'] || false,
        accumulateRangeNoteMxn7Days   : form['range7mxn'] || false,
        tiieNoteMxn196Days            : form['tiie196mxn'] || false,
        accumulatedRangeNoteMxn196Days: form['range196mxn'] || false,
        europeanRangenoteUsd7Days     : form['range7eu'] || false ,
        accumulatedRangeNoteUsd7Days  : form['range7usd'] || false,
        dntNoteUsd7Days               : form['dnt7usd'] || false,
      },
      client: {
        clientOperatesSic       : form['clientSic'] || false,
        clientOperatesStocks    : form['clientActions'] || false,
        clientHasMarginOperation: form['clientMargin'] || false,
        clientHasRetirementPlan : form['clientPlan'] || false,
        retirementPlanType      : form['planType'] ?? '',
        clientHasTrust          : form['clientFc'] || false,
        lenderInvestmentFunds   : form['clientInvestment'] || false,
      },
      generalFeatures: {
        printAccountStatement             : form['accountStatement'] || false,
        settlementAccount                 : form['liquidatingAccount'] || false,
        employeeContract                  : form['employeeContract'] || false,
        contractUsedForCredit             : form['creditContract'] || false,
        creditType                        : form['creditType'] ?? '',
        restrictMoneyMarketOperations     : form['rmmOps'] || false,
        restrictDespositWithdrawals       : form['rdw'] || false,
        restrictTransfers                 : form['restrictTransfers'] || false,
        minimumMarketability              : form['minimumMarketability'],
        minimumMarketabilityClassification: form['mmClass'] || '',
        highSpeedChannel                  : form['highSpeedChannel'] || '',
        noMarketingRequired               : form['noMarketingRequired'] || false,
        stabilizationContracts            : form['stabContracts'] || false,
        indicateSphisticatedClient        : form['sophisticatedClient'] || false,
        alphaInvestmentNumber             : form['alphaInvestment'] || false
      },
      confirmations: {
        selectAllConfirmations     : form['allConfirmations'] || false,
        treasuryDepositsWithdrawals: form['treasuryOperations'] || false,
        capitalMarketsTrading      : form['capitalDeskTrading'] || false,
        moneyMarketsTrading        : form['moneyDeskTrading'] || false,
        investmentFundsTrading     : form['invFundsTrading'] || false
      },
      portfolio: {
        portfolioManagementFee          : form['portfolioAdmin'] ?? false,
        portfolioManagementFeeType      : form['portfolioSafeType'] ?? '',
        contractOriginIsBank            : form['contractOriginBank'],
        alphaInvestment                 : form['alphaInv'] || false,
        alphaInvestmentPortfolio        : form['alphaInvPortType'] ?? '',
        alphaInvestmentPromoter         : form['alphaInvPromo'] ?? '',
        estam                           : form['estacm'] || false,
        privateWealthManagementContract : form['pwmContract'] || false,
        privateWealthManagementPortfolio: form['pwmPortfolio'] ?? '',
        privateWealthManagementPromoter : form['pwmPromo'] ?? '',
        assetManagement                 : form['assetManagement'] || false
      },
      stockExchangeCapital: {
        capitalMarketsRoutingEligibility    : form['futEligCapDesk'] || false,
        activationDate                      : convertDate(form['activationDate']).toString() ?? '',
        activationUserCode                  : form['activationUserCode'] ?? '',
        activationUserName                  : form['activationUserName'] ?? '',
        deactivationDate                    : convertDate(form['deactivationDate']).toString() ?? '',
        deactivationUserCode                : form['deactivationUserCode'] ?? '',
        deactivationUserName                : form['deactivationUserName'] ?? '',
        minimumPortfolioException           : form['minPortException'] || false,
        operatesHighSpeedChannel            : form['highVelocityTrading'] || false,
        qualifiedInvestorKey                : form['distributedClosed'] ?? '',
        repurchaseFundsContracts            : form['repoAgreementFunds'] || false,
        omnibusContract                     : form['derivativeContracts'] || false,
        acceptAutoEntryOperations           : form['extRepoOpsPart'] || false,
        acceptFacilitationOperations        : form['facOpsPart'] || false,
        operatesWarrant                     : form['warrantOperations'],
        shortSales                          : form['shortSalesManagement'] || false,
        participatesGlobalBreakdown         : form['globalBdPart'] || false,
        operatesWithoutPurchasePowerPosition: form['purchPowerPos'] || false
      },
      bankCapitals: {
        operatesWarrant                 : form['operateWithWarrant'] || false,
        shortSales                      : form['shortSalesMgmtAlt'] || false,
        capitalMarketsRoutingEligibility: form['routeEligCapDesk'] || false,
        validityDate                    : convertDate(form['validityDate']).toString() ?? '',
      }
    }
}

export function checkpointToActiweb(data: ActiwebDataCheckpoint): CheckpointDataActiweb{
  console.log(data);
  return {
    // structuredNotes
    structuralStrategies: data.structuredNotes?.structuredNotesStrategiesCp ?? false,
    range7mxn           : data.structuredNotes?.accumulateRangeNoteMxn7Days,
    tiie196mxn          : data.structuredNotes?.tiieNoteMxn196Days,
    range196mxn         : data.structuredNotes?.accumulatedRangeNoteMxn196Days,
    range7eu            : data.structuredNotes?.europeanRangenoteUsd7Days ,
    range7usd           : data.structuredNotes?.accumulatedRangeNoteUsd7Days ,
    dnt7usd             : data.structuredNotes?.dntNoteUsd7Days,

    // client
    clientSic       : data.client?.clientOperatesSic ?? false,
    clientActions   : data.client?.clientOperatesStocks ?? false,
    clientMargin    : data.client?.clientHasMarginOperation ?? false,
    clientPlan      : data.client?.clientHasRetirementPlan ?? false,
    planType        : data.client?.retirementPlanType ?? '',
    clientFc        : data.client?.clientHasTrust ?? false,
    clientInvestment: data.client?.lenderInvestmentFunds ?? false,

    // generalFeatures
    accountStatement    : data.generalFeatures?.printAccountStatement ?? false,
    liquidatingAccount  : data.generalFeatures?.settlementAccount ?? false,
    employeeContract    : data.generalFeatures?.employeeContract ?? false,
    creditContract      : data.generalFeatures?.contractUsedForCredit ?? false,
    creditType          : data.generalFeatures?.creditType ?? '',
    rmmOps              : data.generalFeatures?.restrictMoneyMarketOperations ?? false,
    rdw                 : data.generalFeatures?.restrictDespositWithdrawals ?? false,
    restrictTransfers   : data.generalFeatures?.restrictTransfers ?? false,
    minimumMarketability: data.generalFeatures?.minimumMarketability ?? false,
    mmClass             : data.generalFeatures?.minimumMarketabilityClassification ?? '',
    highSpeedChannel    : data.generalFeatures?.highSpeedChannel ?? '',
    noMarketingRequired : data.generalFeatures?.noMarketingRequired ?? false,
    stabContracts       : data.generalFeatures?.stabilizationContracts ?? false,
    sophisticatedClient : data.generalFeatures?.indicateSphisticatedClient ?? false,
    alphaInvestment     : data.generalFeatures?.alphaInvestmentNumber ?? false,

    // Confirmations
    allConfirmations  : data.confirmations?.selectAllConfirmations ?? false,
    treasuryOperations: data.confirmations?.treasuryDepositsWithdrawals ?? false,
    capitalDeskTrading: data.confirmations?.capitalMarketsTrading ?? false,
    moneyDeskTrading  : data.confirmations?.moneyMarketsTrading ?? false,
    invFundsTrading   : data.confirmations?.investmentFundsTrading ?? false,

    // Portfolio
    portfolioAdmin    : data.portfolio?.portfolioManagementFee ? true: false,
    portfolioSafeType : data.portfolio?.portfolioManagementFeeType ?? '',
    contractOriginBank: data.portfolio?.contractOriginIsBank ?? '',
    alphaInv          : data.portfolio?.alphaInvestmentPortfolio ? true : false,
    alphaInvPromo     : data.portfolio?.alphaInvestmentPromoter ?? '',
    estacm            : data.portfolio?.estam ?? false,
    pwmContract       : data.portfolio?.privateWealthManagementContract ?? false,
    pwmPortfolio      : data.portfolio?.privateWealthManagementPortfolio ?? '',
    pwmPromo          : data.portfolio?.privateWealthManagementPromoter ?? '',
    assetManagement   : data.portfolio?.assetManagement ?? false,
    alphaInvPortType  : data.portfolio?.alphaInvestmentPortfolio ?? '',

    // stockExchangeCapital
    futEligCapDesk      : data.stockExchangeCapital?.capitalMarketsRoutingEligibility ?? false,
    activationDate      : data.stockExchangeCapital?.activationDate ?? '',
    activationUserCode  : data.stockExchangeCapital?.activationUserCode ?? '',
    activationUserName  : data.stockExchangeCapital?.activationUserName ?? '',
    deactivationDate    : data.stockExchangeCapital?.deactivationDate ?? '',
    deactivationUserCode: data.stockExchangeCapital?.deactivationUserCode ?? '',
    deactivationUserName: data.stockExchangeCapital?.deactivationUserName ?? '',
    minPortException    : data.stockExchangeCapital?.minimumPortfolioException ?? false,
    highVelocityTrading : data.stockExchangeCapital?.operatesHighSpeedChannel ?? false,
    distributedClosed   : data.stockExchangeCapital?.qualifiedInvestorKey ?? '',
    derivativeContracts : data.stockExchangeCapital?.omnibusContract ?? false,
    extRepoOpsPart      : data.stockExchangeCapital?.acceptAutoEntryOperations ?? false,
    facOpsPart          : data.stockExchangeCapital?.acceptFacilitationOperations ?? false,
    warrantOperations   : data.stockExchangeCapital?.operatesWarrant ?? false,
    shortSalesManagement: data.stockExchangeCapital?.shortSales ?? false,
    globalBdPart        : data.stockExchangeCapital?.participatesGlobalBreakdown ?? false,
    purchPowerPos       : data.stockExchangeCapital?.operatesWithoutPurchasePowerPosition ?? false,
    repoAgreementFunds  : data.stockExchangeCapital?.repurchaseFundsContracts,

    // bankCapitals
    operateWithWarrant: data.bankCapitals?.operatesWarrant ?? false,
    shortSalesMgmtAlt : data.bankCapitals?.shortSales ?? false,
    routeEligCapDesk  : data.bankCapitals?.capitalMarketsRoutingEligibility ?? false,
    validityDate      : formatDateYYYYMMDD( data.bankCapitals?.validityDate )?? '',
  }
}

