import { ContractNodeData } from '@/types/contract';

export const TEST_CONTRACT: ContractNodeData[] = [
  {
    id: 'test-title',
    type: 'title',
    contentLeft: 'EMPLOYMENT AGREEMENT',
    contentRight: 'CONTRATO DE TRABAJO',
    children: [],
    isExpanded: true,
  },
  {
    id: 'test-intro',
    type: 'intro',
    contentLeft: 'This Employment Agreement (the "Agreement") is made and entered into this 25th day of January, 2026, by and between Tech Corp ("Employer") and John Doe ("Employee").',
    contentRight: 'Este Contrato de Trabajo (el "Contrato") se celebra el día 25 de enero de 2026, entre Tech Corp ("Empleador") y John Doe ("Empleado").',
    children: [],
    isExpanded: true,
  },
  {
    id: 'test-clause-1',
    type: 'clause',
    contentLeft: '1. POSITION AND DUTIES',
    contentRight: '1. CARGO Y RESPONSABILIDADES',
    children: [
      {
        id: 'test-subclause-1-1',
        type: 'subclause',
        contentLeft: '1.1 Position. The Employer agrees to employ the Employee as Senior Developer.',
        contentRight: '1.1 Cargo. El Empleador acuerda contratar al Empleado como Desarrollador Senior.',
        children: [],
        isExpanded: true,
      },
      {
        id: 'test-subclause-1-2',
        type: 'subclause',
        contentLeft: '1.2 Duties. The Employee will perform the duties as assigned by the Employer, consistent with the position of Senior Developer.',
        contentRight: '1.2 Responsabilidades. El Empleado desempeñará las funciones asignadas por el Empleador, de acuerdo con el puesto de Desarrollador Senior.',
        children: [
          {
            id: 'test-item-1-2-1',
            type: 'item',
            contentLeft: 'a) Develop and maintain software applications.',
            contentRight: 'a) Desarrollar y mantener aplicaciones de software.',
            children: [],
            isExpanded: true,
          },
          {
            id: 'test-item-1-2-2',
            type: 'item',
            contentLeft: 'b) Participate in team meetings and code reviews.',
            contentRight: 'b) Participar en reuniones de equipo y revisiones de código.',
            children: [],
            isExpanded: true,
          },
        ],
        isExpanded: true,
      },
    ],
    isExpanded: true,
  },
  {
    id: 'test-clause-2',
    type: 'clause',
    contentLeft: '2. COMPENSATION',
    contentRight: '2. COMPENSACIÓN',
    children: [
      {
        id: 'test-subclause-2-1',
        type: 'subclause',
        contentLeft: '2.1 Base Salary. The Employee shall receive an annual salary of $80,000, payable in accordance with the Employer\'s standard payroll practices.',
        contentRight: '2.1 Salario Base. El Empleado recibirá un salario anual de $80,000, pagadero conforme a las prácticas estándar de nómina del Empleador.',
        children: [],
        isExpanded: true,
      },
      {
        id: 'test-subclause-2-2',
        type: 'subclause',
        contentLeft: '2.2 Bonuses. The Employee may be eligible for bonuses at the discretion of the Employer.',
        contentRight: '2.2 Bonos. El Empleado podrá ser elegible para recibir bonificaciones a discreción del Empleador.',
        children: [],
        isExpanded: true,
      },
    ],
    isExpanded: true,
  },
  {
    id: 'test-clause-3',
    type: 'clause',
    contentLeft: '3. TERM AND TERMINATION',
    contentRight: '3. DURACIÓN Y TERMINACIÓN',
    children: [
      {
        id: 'test-subclause-3-1',
        type: 'subclause',
        contentLeft: '3.1 Term. This Agreement shall commence on the Effective Date and continue until terminated by either party.',
        contentRight: '3.1 Duración. Este Contrato comenzará en la Fecha de Vigencia y continuará hasta que cualquiera de las partes lo termine.',
        children: [],
        isExpanded: true,
      },
      {
        id: 'test-subclause-3-2',
        type: 'subclause',
        contentLeft: '3.2 Termination. Either party may terminate this Agreement with thirty (30) days written notice.',
        contentRight: '3.2 Terminación. Cualquiera de las partes podrá finalizar este Contrato con treinta (30) días de aviso escrito.',
        children: [],
        isExpanded: true,
      },
    ],
    isExpanded: true,
  },
  {
    id: 'test-clause-4',
    type: 'clause',
    contentLeft: '4. CONFIDENTIALITY',
    contentRight: '4. CONFIDENCIALIDAD',
    children: [
      {
        id: 'test-subclause-4-1',
        type: 'subclause',
        contentLeft: '4.1 Obligation. The Employee shall not disclose any confidential information of the Employer during or after employment.',
        contentRight: '4.1 Obligación. El Empleado no revelará ninguna información confidencial del Empleador durante ni después de la relación laboral.',
        children: [],
        isExpanded: true,
      }
    ],
    isExpanded: true,
  },
  {
    id: 'test-final',
    type: 'final_clause',
    contentLeft: 'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.',
    contentRight: 'EN FE DE LO CUAL, las partes han firmado este Contrato en la fecha indicada al inicio.',
    children: [],
    isExpanded: true,
  }
];
