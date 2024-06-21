import * as React from 'react';
import { useSelector } from 'state/hooks/useSelector';
import { Link, useParams } from 'react-router-dom';

const LHS: React.FC = () => {
  let {page} : any = useParams();
  page = page || window.location.pathname.split('/').pop();
  
  const { loadableUser } = useSelector((state) => state);
  const [state, setState] = React.useState({
    sidebar: {
      'Dashboard': '',
      'Quiz Overview': 'quiz-overview',
      'Users Panel': {
        menus: {
          'Users': 'users',
          'Banned Users': 'banned-users',
          'Kyc Request': 'kyc-request',
          'Withdrawal Request': 'withdrawal-request',
        }
      },
      'Quiz Panel': {
        menus: {
          'Quiz': 'quiz',
          'Reward Matrix': 'quiz-matrix',
          'Categories': 'quiz-category',
          'Questions': 'quiz-question',
        }
      },
      'Questions Panel': {
        menus: {
          'Class Types': 'ques-ms-class-type',
          'Classes': 'ques-ms-class',
          'Categories': 'ques-ms-category',
          'Authors': 'ques-ms-author',
          'Books': 'ques-ms-book',
          'Chapters': 'ques-ms-chapter',
          'Questions': 'ques-ms-question',
          'Image Questions': 'ques-ms-img-question',
          'Description Questions': 'ques-ms-desc-question',
        }
      },
      'Blogs Panel': {
        menus: {
          'Blogs': 'blog-ms-blogs',
          'Blog Tags': 'blog-ms-tags',
          'Blog Categories': 'blog-ms-category',
          'Blog Authors': 'blog-ms-author',
        }
      },
      'Admin Panel': {
        menus: {
          'Admin Users': 'admin-users',
          'Admin Permission': 'admin-permission',
        }
      },
      'Others': {
        menus: {
          'Pages': 'custom-pages',
          'Bonus Redemption': 'bonus-redemption',
          'Ban Plans': 'ban-plans',
          'Masquerade': 'masquerade',
        }
      }
    },
    activeLink: '',
    activeMenu: ''
  });

  const menuClickHandler = (e, menuKey: string) => {
    setState((prevState) => ({ ...prevState, activeMenu: state.activeMenu === menuKey ? '' : menuKey }));
  }

  const linkClickHandler = (e, menuKey: string) => {
    setState((prevState) => ({ ...prevState, activeLink: menuKey }));
  }

  const user = loadableUser.isSuccess ? loadableUser.user.data : false;
  if(!user) {
    return <></>;
  }

  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <Link to="/" className="brand-link">
          <img src="/images/logo.png" alt="Edulete Admin Logo" className="brand-image img-circle elevation-3"/>
          <span className="brand-text font-weight-light">Edulete Admin</span>
        </Link>

        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src={user.image ? `${process.env.REACT_APP_UPLOAD_PATH}${user.image}` : "/images/avatar.png"} className="img-circle elevation-2" alt="User Image"/>
            </div>
            <div className="info">
              <Link to='/' className="d-block">{user.name}</Link>
            </div>
          </div>

          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
              {Object.keys(state.sidebar).map((menu, key) => {
                if(typeof state.sidebar[menu] === 'string' && state.sidebar[menu] === page && state.sidebar[menu] !== state.activeLink) {
                  setState((prevState) => ({ ...prevState, activeLink: state.sidebar[menu] }));
                }

                const link = typeof state.sidebar[menu] === 'string' ? '/' + state.sidebar[menu] : '#';
                if(link === '#') {
                  let sub_menu = 0;
                  Object.keys(state.sidebar[menu].menus).map((index, key1) => {
                    if((user.permission?.[state.sidebar[menu].menus[index]] || []).indexOf('r') > -1) {
                      sub_menu++;
                    }
                  });
                  if(sub_menu < 1) { return ''; }
                } else if(state.sidebar[menu] !== '' && (user.permission?.[state.sidebar[menu]] || []).indexOf('r') < 0) {
                  return '';
                }

                return (
                  <li key={key} className={(state.sidebar[menu].menus && (state.activeMenu === state.sidebar[menu] || Object.values(state.sidebar[menu].menus).indexOf(state.activeLink) > -1) ? 'menu-open' : '') + " nav-item"}>
                    <Link to={link} className={(typeof state.sidebar[menu] === 'string' && state.sidebar[menu] === state.activeLink ? 'active' : '') + ' nav-link'} {...state.sidebar[menu].menus ? {onClick: (e) => menuClickHandler(e, state.sidebar[menu])} : {onClick: (e) => linkClickHandler(e, state.sidebar[menu])}}>
                      <i className="nav-icon fas fa-tachometer-alt"></i>
                      <p>
                        {menu}
                        {state.sidebar[menu].menus ? <>
                          <i className="right fas fa-angle-left"></i>
                        </> : ''}
                      </p>
                    </Link>

                    {state.sidebar[menu].menus ? <>
                      <ul className="nav nav-treeview">
                        {Object.keys(state.sidebar[menu].menus).map((index, key1) => {
                          if(state.sidebar[menu].menus[index] === page && page !== state.activeLink) {
                            setState((prevState) => ({ ...prevState, activeLink: state.sidebar[menu].menus[index] }));
                          }

                          if((user.permission?.[state.sidebar[menu].menus[index]] || []).indexOf('r') < 0) {
                            return '';
                          }
                                 
                          return (
                            <li key={key1} className="nav-item">
                              <Link to={'/' + state.sidebar[menu].menus[index]} className={(state.sidebar[menu].menus[index] === state.activeLink ? 'active' : '') + ' nav-link'} onClick={(e) => linkClickHandler(e, state.sidebar[menu].menus[index])}>
                                <i className="far fa-circle nav-icon"></i>
                                <p>{index}</p>
                              </Link>
                            </li>
                          )
                        }
                        )}
                      </ul>
                    </> : ''}
                  </li>
                )
            })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default LHS;
