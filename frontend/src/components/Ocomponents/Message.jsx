const Message = (text) => {
   const style = {
      backgroundColor: 'blue',
      color: '#FFFFFF',
      width: '90%',
      height: '40px',
      position: 'absolute',
      top: '20px',
      left: '5%',
      padding:'10px',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
   };

   return (
      <div style={style}>
         {text}
      </div>
   );
};

export default Message;
