import { TestBed } from '@angular/core/testing';

import { DirectorateSignalService } from './directorate-signal.service';
import { DirectoratePageData } from '../../models/directorate';

describe('DirectorateSignalService', () => {
  let service: DirectorateSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectorateSignalService],
    });

    service = TestBed.inject(DirectorateSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar con data y table vacias', () => {
    expect(service.getData()).toEqual({
      data: [],
      table: [],
    });

    expect(service.directorate()).toEqual({
      data: [],
      table: [],
    });
  });

  it('setData debe guardar informacion y getData debe retornarla', () => {
    const payload: DirectoratePageData = {
      data: [
        {
          tempId: 'tmp-1',
          adminType: 'TITULAR',
          firstName: 'JUAN',
          secondFirstName: 'CARLOS',
          lastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          position: 'DIRECTOR',
        },
      ],
      table: [
        {
          tempId: 'tmp-1',
          adminType: 'TITULAR',
          firstName: 'JUAN',
          secondFirstName: 'CARLOS',
          lastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          position: 'DIRECTOR',
        },
      ],
    };

    service.setData(payload);

    expect(service.getData()).toEqual(payload);
    expect(service.directorate()).toEqual(payload);
  });

  it('clear debe limpiar la signal a su valor inicial', () => {
    const payload: DirectoratePageData = {
      data: [
        {
          tempId: 'tmp-2',
          adminType: 'SUPLENTE',
          firstName: 'ANA',
          secondFirstName: '',
          lastName: 'GARCIA',
          secondLastName: 'DIAZ',
          position: 'CONSEJERO',
        },
      ],
      table: [
        {
          tempId: 'tmp-2',
          adminType: 'SUPLENTE',
          firstName: 'ANA',
          secondFirstName: '',
          lastName: 'GARCIA',
          secondLastName: 'DIAZ',
          position: 'CONSEJERO',
        },
      ],
    };

    service.setData(payload);
    expect(service.getData()).toEqual(payload);

    service.clear();

    expect(service.getData()).toEqual({
      data: [],
      table: [],
    });
  });
});
