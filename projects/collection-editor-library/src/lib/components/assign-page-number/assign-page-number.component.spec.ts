import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignPageNumberComponent } from './assign-page-number.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../../services/tree/tree.service';
import { mockTreeService } from '../fancy-tree/fancy-tree.component.spec.data';
import { EditorService } from '../../services/editor/editor.service';
import { of, throwError } from 'rxjs';
import { QuestionService } from '../../services/question/question.service';

const mockEditorService = {
  getToolbarConfig: () => { },
  getHierarchyObj: () => { },
  treeData: {}
};

describe('AssignPageNumberComponent', () => {
  let component: AssignPageNumberComponent;
  let fixture: ComponentFixture<AssignPageNumberComponent>;
  // tslint:disable-next-line:one-variable-per-declaration
  let treeService, editorService, questionService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AssignPageNumberComponent],
      providers: [
        QuestionService,
        { provide: TreeService, useValue: mockTreeService },
        { provide: EditorService, useValue: mockEditorService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPageNumberComponent);
    treeService = TestBed.get(TreeService);
    editorService = TestBed.inject(EditorService);
    questionService = TestBed.get(QuestionService);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should called', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(editorService, 'getToolbarConfig').and.returnValue({
      title: 'Observation Form'
    });
    editorService.treeData = [
      {
        children:[
          {
            id:"1234"
          }
        ]
      }
    ]
    component.treeData = editorService.treeData;
    spyOn(editorService, 'getHierarchyObj').and.callFake(() => {
      return {
        '1234': {
          children : []
        }
      };
    });
    spyOn(questionService, 'getQuestionList').and.returnValue(of({
      result: {
        questions: [
          {
            editorState: {
              options: [
                {
                  answer: false,
                  value: {
                    body: '<p>Yes</p>',
                    value: 0
                  }
                },
              ],
              question: '<p>Yes or No?</p>'
            },
            identifier: '1234',
            languageCode: [
              'en'
            ]
          }
        ],
        count: 1
      }
    }));
    component.toolbarConfig.title = 'Observation Form';
    component.ngOnInit();
    expect(component.toolbarConfig).toBeDefined();
    expect(component.toolbarConfig.title).toEqual('Observation Form');
  });

  it('#toolbarEventListener() should call #handleRedirectToQuestionSet() if event is backContent', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    spyOn(component, 'redirectToQuestionSet').and.callThrough();
    const event = {
      button: 'backContent'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToQuestionSet).toHaveBeenCalled();
  });

  it('#redirectToQuestionSet() should emit #assignPageEmitter event', () => {
    spyOn(component.assignPageEmitter, 'emit');
    component.redirectToQuestionSet();
    expect(component.assignPageEmitter.emit).toHaveBeenCalledWith({ status: false });
  });

  it('#treeEventListener should call api call success', () => {
    spyOn(component, 'treeEventListener').and.callThrough();
    spyOn(editorService, 'getHierarchyObj').and.callFake(() => {
      return {
        '1234': {
          children : []
        }
      };
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { identifier: '0123', allowScoring: 'Yes' } } };
    });
    spyOn(questionService, 'getQuestionList').and.returnValue(of({
      result: {
        questions: [
          {
            editorState: {
              options: [
                {
                  answer: false,
                  value: {
                    body: '<p>Yes</p>',
                    value: 0
                  }
                },
              ],
              question: '<p>Yes or No?</p>'
            },
            identifier: '1234',
            languageCode: [
              'en'
            ]
          }
        ],
        count: 1
      }
    }));
    component.treeEventListener({ event: { identifier: '1234' } });
  });

  it('#treeEventListener should call api call fail', () => {
    spyOn(component, 'treeEventListener').and.callThrough();
    spyOn(editorService, 'getHierarchyObj').and.callFake(() => {
      return {
        '1234': {
          children : []
        }
      };
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { identifier: '0123', allowScoring: 'Yes' } } };
    });
    spyOn(treeService, 'getHierarchyObj').and.callFake(() => {
      return { 1234: { children: ['1234567'] } };
    });
    spyOn(questionService, 'getQuestionList').and.returnValue(throwError({}));
    component.treeEventListener({ event: { identifier: '1234' } });
  });


});
