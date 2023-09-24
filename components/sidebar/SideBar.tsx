import styled from "styled-components";
import Menu from "components/sidebar/Menu";

const Wrapper = styled.div`
  width: 15vw;
  height: inherit;
  background-color: #004700;
`;
const Lr = styled.div`
  width: 10vw;
  height: 1px;
  background-color: white;
  margin-left: 2.5vw;
  margin-top: 2vh;
  margin-bottom: 3vh;
`;
const Logo = styled.img`
  width: 15vw;
  padding: 15%;
  cursor: pointer;
`;

function SideBar() {
  const menuList = ["home", "dashboard", "contract"];

  const menuListNew = [
    { id: 0, menuName: "HOME", URL: "" },
    //{id : 1, menuName : "BACKOFFICE", URL : "backoffice"},
    { id: 2, menuName: "FULLHOUSE", URL: "fullhouse" },
    //{ id: 3, menuName: "META KONGZ", URL: "metakongz" },
    { id: 4, menuName: "PRISM", URL: "prism" },
  ];

  return (
    <nav aria-label="alternative nav">
      <div className="bg-gray-800 shadow-xl h-20 fixed bottom-0 mt-12 md:relative md:h-screen z-10 w-full md:w-48 content-center">
        <div className="md:mt-12 md:w-48 md:fixed md:left-0 md:top-0 content-center md:content-start text-left justify-between">
          <ul className="list-reset flex flex-row md:flex-col pt-3 md:py-3 px-1 md:px-2 text-center md:text-left">
            {menuListNew.map((val, idx) => {
              return (
                <li className="mr-3 flex-1" key={idx}>
                  <a
                    href={`/${val.URL}`}
                    className="block py-1 md:py-3 pl-1 align-middle text-white no-underline hover:text-white border-b-2 border-gray-800 hover:border-pink-500"
                  >
                    <i className="fas fa-tasks pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base text-gray-400 md:text-gray-200 block md:inline-block">
                      {val.menuName}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
