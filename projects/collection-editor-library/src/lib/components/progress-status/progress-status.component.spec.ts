import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorService } from '../../services/editor/editor.service';
import { QuestionService } from '../../services/question/question.service';
import { ProgressStatusComponent } from './progress-status.component';

const mockEditorService = {
  getToolbarConfig: () => { },
  getHierarchyObj: () => { },
  treeData: {}
};

describe('ProgressStatusComponent', () => {
  let component: ProgressStatusComponent;
  let fixture: ComponentFixture<ProgressStatusComponent>;
  let editorService,questionService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ProgressStatusComponent ],
      providers: [
        QuestionService,
        { provide: EditorService, useValue: mockEditorService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressStatusComponent);
    editorService = TestBed.inject(EditorService);
    questionService = TestBed.get(QuestionService);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should called', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(editorService, 'getToolbarConfig').and.returnValue({
      title: 'Observation Form'
    });
    component.toolbarConfig.title = 'Observation Form';
    component.ngOnInit();
    expect(component.toolbarConfig).toBeDefined();
    expect(component.toolbarConfig.title).toEqual('Observation Form');
  })

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

  it('#expand() is true',()=>{
    let event = {criteria:"differentText"};
    component.expandedElement="diffText"
    component.expand(event);
    expect(component.expandedElement).toEqual("differentText");
 })
 
 it('#expand() is false',()=>{
    let event = {criteria:"sameText"};
    component.expandedElement="sameText"
    spyOn(component, 'expand').and.callThrough();
    component.expand(event);
    expect(component.expandedElement).toEqual("");
 });
});
