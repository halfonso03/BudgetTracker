// import { useState } from 'react';
// import { Plus, Search } from 'lucide-react';
// import Button from '../../components/Button';
// import ChooseYearModal from './ChooseYearModal';
// import MenuIdProvider from '../../contexts/MenuIdContext';
// import ConfirmModal from '../../components/ConfirmModal';

// import 'react-dropdown/style.css';

// const ReproHome = () => {
//   const [reproId, setReproId] = useState('');
//   const [choosingYear, setChoosingYear] = useState(false);
//   const [year, setYear] = useState<number>(0);

//   const [addingLine, setAddingLine] = useState(false);
//   const [isDiscarding, setIsDiscarding] = useState(false);
//   const [lines, setLines] = useState<ReproLineItem[]>([]);

//   const [animateOutYearSelect, setAnimateOutYearSelect] =
//     useState<boolean>(false);
//   const [animateOutDiscarding, setAnimateOutDiscarding] =
//     useState<boolean>(false);

//   const [repro, setRepro] = useState<Repro | null>(null);




//   return (
//     <MenuIdProvider>
//       <div className="">
//         <div className="flex justify-end gap-3">
//           <Button
//             buttonSize="small"
//             variation="primary"
//             onClick={() => setChoosingYear(true)}
//             disabled={year > 0}
//           >
//             Start New...
//           </Button>
//           <Button
//             buttonSize="small"
//             variation="secondary"
//             disabled={year > 0}
//             onClick={() => {}}
//           >
//             <Search></Search>
//           </Button>
//           <Button
//             variation="danger"
//             buttonSize="small"
//             disabled={year === 0}
//             onClick={() => {
//               setIsDiscarding(true);

//               // setYear(0);
//               // setLines([]);
//             }}
//           >
//             Discard
//           </Button>
//         </div>
//       </div>

//       <div className="flex gap-10 mb-6">
//         {year > 0 && (
//           <div>
//             <span className="text-neutral-500 font-bold mr-4">Year</span>
//             <span className="font-semibold">{year}</span>
//           </div>
//         )}

//         <div>
//           {year > 0 && (
//             <div>
//               <span className="text-neutral-500 font-bold mr-4">ID</span>
//               <span className="font-semibold">
//                 {reproId == '' ? '-' : reproId}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="mb-8">
//         {year > 0 && (
//           <Button
//             buttonSize="small"
//             onClick={() => {
//               setAddingLine(true);
//             }}
//           >
//             <Plus></Plus>
//             Add Line
//           </Button>
//         )}
//       </div>
//       <div>
//         {lines.length > 0 && (
//           <div>
//             <div className="grid grid-cols-[1.5fr_1fr_.8fr_1.7fr_1fr_.8fr_.8fr_.8fr_.4fr]  px-3 py-4 font-bold text-neutral-500">
//               <div className="pl-1">Initiative</div>
//               <div>Grant</div>
//               <div>Category</div>
//               <div>Account</div>
//               <div className="text-center">Current Amount</div>
//               <div className="text-end pr-2">Increase</div>
//               <div className="text-end pr-2">Decrease</div>
//               <div className="text-end pr-2">New Amount</div>
//               <div></div>
//             </div>
//           </div>
//         )}
//       </div>
//       <ChooseYearModal
//         isOpen={choosingYear}
//         animateOut={animateOutYearSelect}
//         onYearSelected={(year: number) => {
//           setAnimateOutYearSelect(true);
//           setYear(year);
//           setTimeout(() => {
//             setChoosingYear(false);
//             setAnimateOutYearSelect(false);

//             setRepro(null);
//           }, 500);
//         }}
//         onCancel={() => {
//           setAnimateOutYearSelect(true);
//           setTimeout(() => {
//             setChoosingYear(false);
//             setAnimateOutYearSelect(false);
//           }, 500);
//         }}
//       ></ChooseYearModal>

//       <ConfirmModal
//         key={new Date().getMilliseconds()}
//         isOpen={isDiscarding}
//         animateOut={animateOutDiscarding}
//         onCancel={() => {
//           setAnimateOutDiscarding(true);
//           setTimeout(() => {
//             setIsDiscarding(false);
//             setAnimateOutDiscarding(false);
//           }, 500);
//         }}
//         onConfirm={() => {
//           setAnimateOutDiscarding(true);
//           setTimeout(() => {
//             setLines([]);
//             setIsDiscarding(false);
//             setAnimateOutDiscarding(false);
//             setYear(0);
//           }, 500);
//         }}
//         message={'Are you sure you wish to discard this reprogramming?'}
//       ></ConfirmModal>
//     </MenuIdProvider>
//   );
// };
// export default ReproHome;
