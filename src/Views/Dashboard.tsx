import React, { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import Utils from "../Models/Utils";
import { Menu, PlayArrow } from "@mui/icons-material";
// import Chart from 'chart.js/auto';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AlertContext from "../Contexts/AlertContext";
import MainAPI from "../APIs/MainAPI";
import Operators from "../Enums/Operators";
import FieldTypes from "../Enums/FiedTypes";

import { useNavigate } from "react-router-dom";
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ListComponent from "./ListComponent";
import TablePage from "./TablePage";
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminAPI from "../APIs/AdminAPI";
import IPagination from "../Intefaces/IPagination";
import { Stepper, Step, StepLabel, StepContent, Button, Typography, IconButton } from '@mui/material';

import {
	Chart,
	ChartConfiguration,
	DoughnutController,
	ArcElement,
	Tooltip,
	Legend,
  } from 'chart.js';
  Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

function Dashboard() {

	const { setAlert, setWaiting, setMenu, menu } = useContext(AlertContext);
	const {loggedUser, cookies, localData} = useContext(AuthContext);
	const [balance, setBalance] = useState<Map<number, { tickets: any[], pay_in: number, pay_out: number }>>(new Map());
	const [isAdmin, setIsAdmin] = useState<boolean>(true);
	const [orders, setOrders] = useState<any[]>([]);
	const [chartData, setChartData] = useState<any>({});
	const [contacts, setContacts] = useState<any[]>([]);
	const [inputs, setInputs] = useState<any>({
		startDate: "",
		endDate: ""
	});
	const [blogCount, setBlogCount] = useState(0);
	const [contactCount, setContactCount] = useState(0);
	const [eventCount, setEventCount] = useState(0);
	const [serviceCount, setServiceCount] = useState(0);
	const [overdueBooks, setOverdueBooks] = useState([]);


	const navigate = useNavigate();

	const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart<'doughnut'> | null>(null);
	const [counts, setCounts] = useState({
		blogCount: 0,
		contactCount: 0,
		eventCount: 0,
		serviceCount: 0,
	});

 
	useEffect(() => {
		fetchCounts();
	}, []);
	
	const fetchCounts = async () => {
		try {
			
			const blogResponse:any = await AdminAPI.getTotalCount( cookies.login_token,`library_management.api.get_total_count`);
			setBlogCount(blogResponse.Items.message.total_users);
	console.log('blogCount++++++++++++', blogResponse);
			
			const contactResponse = await AdminAPI.getTotalCount(cookies.login_token,`library_management.api.get_total_count`);
			setContactCount(contactResponse.Items.message.total_books);
	
			
			const eventResponse = await AdminAPI.getTotalCount( cookies.login_token,`library_management.api.get_total_count`);
			setEventCount(eventResponse.Items.message.total_loans);
	
			
			const serviceResponse = await AdminAPI.getTotalCount(cookies.login_token,`library_management.api.get_total_count`);
			setServiceCount(serviceResponse.Items.message.total_members);
			setCounts({
				blogCount: blogResponse.Items.message.total_users,
				contactCount: contactResponse.Items.message.total_books,
				eventCount: eventResponse.Items.message.total_loans,
				serviceCount: serviceResponse.Items.message.total_members,
			});
		} catch (error) {
			console.error("Error fetching counts:", error);
			setAlert("Failed to fetch counts from backend.");
		}
	};
	
	useEffect(() => {
		const data = {
		  labels: ['User', 'Books', 'Members','Loans'],
		  datasets: [
			{
			  label: 'Total Count',
			  data: [counts.blogCount, counts.contactCount, counts.eventCount, counts.serviceCount],
			  backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)' ],
			  hoverOffset: 4,
			},
		  ],
		};
	
		const config: ChartConfiguration<'doughnut'> = {
		  type: 'doughnut',
		  data: data,
		  options: {
			responsive: true,
			maintainAspectRatio: false,
		  },
		};
	
		if (chartRef.current) {
		  chartInstance.current = new Chart(chartRef.current, config);
		}
	
		return () => {
		  if (chartInstance.current) {
			chartInstance.current.destroy();
		  }
		};
	  },  [counts]);
	

	useEffect(() => {
		const loadOverdueBooks = async () => {
			try {
			
				let data: any = await AdminAPI.getAllwithoutPagination(cookies.login_token,  "library_management.api.get_overdue_books" );
				setOverdueBooks(data.Items); 
				console.log('overdueBooks', overdueBooks);
				
			} catch (error) {
				setAlert("Error fetching recent contact submissions:", error);
			}
		};
	
		loadOverdueBooks(); 
	}, );  

	

	const inputOnChange = async (event: any) => {
		setInputs((inp: any) => ({...inp, [event.target.name]: event.target.value}));
	}

	

	return (
		<div className="w-100 py-3 px-4" style={{width: "100%", height: "max-content"}}>
			<h3 className="card-title mb-3" style={{color: "var(--text_color)"}}>Dashboard</h3>

			<div className="d-flex justify-content-between mb-3 " style={{flexWrap: "wrap"}}>

				<div className="col-12 col-sm-12 col-md-2 col-lg-3 px-2 mb-3">
					<div className="card rounded-3 zpanel" style={{width: "100%"}}>
						<div className="card-body">
							<div className="d-flex justify-content-between">
								<div className="">
									<h6 className="text-muted" style={{color: "var(--border_color) !important"}}>Total Users</h6>
									<h4 className="card-title">{blogCount}</h4>
								</div>
								<span>
									<div className="rounded-4 p-2" style={{background: "#8280FF57", color: "#8280FFFF", overflow: "hidden"}}>
										<GroupIcon sx={{fontSize: 30}} />
									</div>
								</span>
							</div>
						
						</div>
					</div>
				</div>
				<div className="col-12 col-sm-12 col-md-2 col-lg-3 px-2 mb-3">
					<div className="card rounded-3 zpanel" style={{width: "100%"}}>
						<div className="card-body">
							<div className="d-flex justify-content-between">
								<div className="">
									<h6 className="text-muted" style={{color: "var(--border_color) !important"}}>Total Books</h6>
									<h4 className="card-title">{contactCount}</h4>
								</div>
								<span>
									<div className="rounded-4 p-2" style={{background: "#FEC43D50", color: "#FEC53D", overflow: "hidden"}}>
										<ViewInArIcon sx={{fontSize: 30}} />
									</div>
								</span>
							</div>
							{/* <span className="text-muted" style={{fontSize: "13px"}}>Up from yesterday</span> */}
						</div>
					</div>
				</div>
				<div className="col-12 col-sm-12 col-md-2 col-lg-3 px-2 mb-3">
					<div className="card rounded-3 zpanel" style={{width: "100%"}}>
						<div className="card-body">
							<div className="d-flex justify-content-between">
								<div className="">
									<h6 className="text-muted"style={{color: "var(--border_color) !important"}}>Total Members</h6>
									<h4 className="card-title">{eventCount}</h4>
								</div>
								<span>
									<div className="rounded-4 p-2" style={{background: "#4AD9925E", color: "#4AD991", overflow: "hidden"}}>
										<TrendingUpIcon sx={{fontSize: 30}} />
									</div>
								</span>
							</div>
							{/* <span className="text-muted" style={{fontSize: "13px"}}>Up from yesterday</span> */}
						</div>
					</div>
				</div>
				<div className="col-12 col-sm-12 col-md-2 col-lg-3 px-2">
					<div className="card rounded-3 zpanel" style={{width: "100%"}}>
						<div className="card-body">
							<div className="d-flex justify-content-between">
								<div className="">
									<h6 className="text-muted" style={{color: "var(--border_color) !important"}}>Total loans</h6>
									<h4 className="card-title">{serviceCount}</h4>
								</div>
								<span>
									<div className="rounded-4 p-2" style={{background: "#FF8F6654", color: "#FF9066", overflow: "hidden"}}>
										<HistoryIcon sx={{fontSize: 30}} />
									</div>
								</span>
							</div>
							{/* <span className="text-muted" style={{fontSize: "13px", color: "var(--border_color) !important"}}>Up from yesterday</span> */}
						</div>
					</div>
				</div>
			</div>
			<div className="card rounded-3 mb-3 w-100 zpanel" style={{ height: "auto", padding: "1rem", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
				<div className="row g-3">
						<div className="col-12 col-sm-6 col-md-4 d-flex " style={{ borderRight: "1px solid #e0e0e0", paddingRight: "1rem" }}>
							<canvas ref={chartRef} style={{position: 'relative', maxHeight: "300px", width: "100%" }} />
						</div>

						<div className="col-12 col-sm-6 col-md-8">
  <div
    className="card-body"
    style={{ maxHeight: "500px", overflowY: "auto", paddingLeft: "1rem" }}
  >
    <h5
      className="card-title"
      style={{
        fontSize: "1.2rem",
        fontWeight: "600",
        marginBottom: "1rem",
        color: "#333",
      }}
    >
      Overdue Books
    </h5>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Member Name</th>
          <th>Book Title</th>
          <th>Loan Date</th>
          <th>Return Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {overdueBooks.map((contact: any) => (
          <tr key={contact.loan_id}>
            <td>{contact.member_name}</td>
            <td>{contact.book_title}</td>
            <td>{Utils.convertISOToDate(contact.loan_date)}</td>
            <td>{Utils.convertISOToDate(contact.return_date)}</td>
            <td>
              <IconButton
                color="primary"
                onClick={() => navigate(`/form/tbl_loan/${contact.loan_id}`)}
                style={{ padding: "0.25rem" }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

			</div>
</div>


		

		</div>
	);
}

export default Dashboard;