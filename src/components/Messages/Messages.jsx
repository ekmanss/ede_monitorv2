import { useDispatch, useSelector } from "react-redux";
import { close, handle_obsolete } from "../../slices/MessagesSlice";
import store from "../../store";
import "./ConsoleInterceptor.js";
import './messages.scss'
import { Box } from "@material-ui/core";
import Close from '../../assets/images/message/close.svg'
import Vector from '../../assets/images/message/Vector.svg'
import Vector2 from '../../assets/images/message/Vector2.svg'
import Vector3 from '../../assets/images/message/Vector3.svg'
import Vector4 from '../../assets/images/message/Vector4.svg'
import Success from '../../assets/images/message/success.svg'
import Fail from '../../assets/images/message/fail.svg'
import Question from '../../assets/images/message/question.svg'
import Warning from '../../assets/images/message/warning.svg'

// A component that displays error messages
function Messages() {
  const messages = useSelector(state => state.messages);
  const dispatch = useDispatch();
  // Returns a function that can closes a message
  const handleClose = function (message) {
    return function () {
      dispatch(close(message));
    };
  };
  return (
    <div>
      {messages.items.map((message, index) => {
        return (
          <div className="loading-view" key={index}>
            {
              message.severity == 'success' ?
                <div className='messageInfo bg1' style={{ display: message.open ? 'block' : 'none' }}>
                  <Box display='flex' justifyContent='space-between' alignItems='flex-start' className="message">
                    <Box display='flex' className="flex-1 message-l">
                      <img src={Success} className="messageIcon" />
                      <img src={Vector} />
                      <div className="" style={{ margin: '16px auto 16px 32px' }}>
                        <div className="messageTitle font-20">Well done!</div>
                        <div className="messageContent font-14" >{message.text}</div>
                      </div>
                    </Box>
                    <img src={Close} className="mt-26 ml-12" onClick={handleClose(message)} />
                  </Box>
                </div>
                :
                message.severity == 'error' ?
                  <div className='messageInfo bg2' style={{ display: message.open ? 'block' : 'none' }}>
                    <Box display='flex' justifyContent='space-between' alignItems='flex-start' className="message">
                      <Box display='flex' className="flex-1 message-l">
                        <img src={Fail} className="messageIcon" />
                        <img src={Vector3} />
                        <div className="" style={{ margin: '16px auto 16px 32px' }}>
                          <div className="messageTitle font-20">Oh snap!</div>
                          <div className="messageContent font-14" >{message.text}</div>
                        </div>
                      </Box>
                      <img src={Close} className="mt-26 ml-12" onClick={handleClose(message)} />
                    </Box>
                  </div>
                  :
                  message.severity == 'warn' ?
                    <div className='messageInfo bg3' style={{ display: message.open ? 'block' : 'none' }}>
                      <Box display='flex' justifyContent='space-between' alignItems='flex-start' className="message">
                        <Box display='flex' className="flex-1 message-l">
                          <img src={Warning} className="messageIcon" />
                          <img src={Vector2} />
                          <div className="" style={{ margin: '16px auto 16px 32px' }}>
                            <div className="messageTitle font-20">Warning!</div>
                            <div className="messageContent font-14" >{message.text}</div>
                          </div>
                        </Box>
                        <img src={Close} className="mt-26 ml-12" onClick={handleClose(message)} />
                      </Box>
                    </div>
                    :
                    <div className='messageInfo bg4' style={{ display: message.open ? 'block' : 'none' }}>
                      <Box display='flex' justifyContent='space-between' alignItems='flex-start' className="message">
                        <Box display='flex' className="flex-1 message-l">
                          <img src={Question} className="messageIcon" />
                          <img src={Vector4} />
                          <div className="" style={{ margin: '16px auto 16px 32px' }}>
                            <div className="messageTitle font-20">Hi there!</div>
                            <div className="messageContent font-14" >{message.text}</div>
                          </div>
                        </Box>
                        <img src={Close} className="mt-26 ml-12" onClick={handleClose(message)} />
                      </Box>
                    </div>
            }
          </div>
        );
      })}
    </div>
  );
  return res;
}
window.setInterval(() => {
  store.dispatch(handle_obsolete());
}, 3000);
export default Messages;
