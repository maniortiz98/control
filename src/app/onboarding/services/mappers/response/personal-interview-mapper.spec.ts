import { mapResToPersonalInterview } from './personal-interview-mapper';

describe('response/personal-interview-mapper', () => {
  it('should map interview response including numeric conversions and nested risk data', () => {
    const result = mapResToPersonalInterview({
      date: '20/05/2026',
      interviewee: 'Advisor',
      opening: 'remote',
      interviewLocation: 'office',
      question1: true,
      question2: true,
      question3: false,
      homeVisit: true,
      addressType: '5',
      clientNumber: '123',
      lowRisk: {
        companyName: 'Actinver',
        jobTitle: 'Analyst',
        timeWorking: '5',
      },
      mediumRisk: {
        initialInvestmentInActinver: '1000',
        relationship: 7,
        justificationInitialInvestment: true,
      },
      highRisk: {
        productsOffered: 'Funds',
        inventory: true,
      },
    } as any);

    expect(result).toEqual(
      jasmine.objectContaining({
        date: '20/05/2026',
        interviewee: 'Advisor',
        addressType: 5,
        clientNumber: 123,
        lowRisk: jasmine.objectContaining({ companyName: 'Actinver' }),
        mediumRisk: jasmine.objectContaining({ relationship: '7' }),
        highRisk: jasmine.objectContaining({ inventory: true }),
      }),
    );
  });

  it('should apply defaults for missing nested structures', () => {
    const result = mapResToPersonalInterview({} as any);

    expect(result).toEqual(
      jasmine.objectContaining({
        date: '',
        question1: false,
        question2: false,
        question3: false,
        lowRisk: { companyName: '', jobTitle: '', timeWorking: '' },
        mediumRisk: {
          initialInvestmentInActinver: '',
          relationship: '',
          justificationInitialInvestment: false,
        },
        highRisk: { productsOffered: '', inventory: false },
      }),
    );
  });
});