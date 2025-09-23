

export const toolbarOps = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [
      { 'link': ''}, 
      /* { 'image': '' }, 
      { 'video': '' } */
    ],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean'],
  ]

  export const makeSteps = (ref1) => {
    let steps = [
      {
        title: 'Integración de escritura asistida por voz',
        description: 'Presione Ctrl+B para comenzar a grabar.',
        cover: (
          <img
            
            alt="voice.png"
            src="/voice.png"
          />
        ),
        target: () => ref1.current,
        mask: {
          style: {
            boxShadow: 'inset 0 0 15px #fff',
          },
          color: 'rgba(40, 0, 255, .4)',
        },
      },
      {
        title: 'Integración de escritura asistida por voz',
        description: 'Luego cuando termmine presione Ctrl+P para detenerlo.',
        cover: (
          <img
          className="h-24 w-36"
            alt="voice.png"
            src="/voice.png"
          />
        ),
        target: () => ref1.current,
        mask: {
          style: {
            boxShadow: 'inset 0 0 15px #fff',
          },
          color: 'rgba(40, 0, 255, .4)',
        },
      },
    ];
    return steps;
  }