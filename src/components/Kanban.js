import React, { useState, useEffect } from 'react';
import "../css/Kanban.css"
function Kanban() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupingOption, setGroupingOption] = useState(localStorage.getItem('groupingOption') || 'status');
    const [sortingOption, setSortingOption] = useState(localStorage.getItem('sortingOption') || 'priority');
    const [showOption, setShowOption] = useState(false);

    useEffect(() => {
        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then(response => response.json())
            .then(data => {
                setTickets(data.tickets);
                setUsers(data.users);
            });
    }, []);
    const handleShowOption = () => {
        setShowOption(!showOption);
    };
    useEffect(() => {
        localStorage.setItem('groupingOption', groupingOption);
        localStorage.setItem('sortingOption', sortingOption);
    }, [groupingOption, sortingOption]);
    const groupTickets = (tickets, option) => {
        const statusMapping = {
            'In progess': 'Inprogress'
        };

        const groupedTickets = {
            Backlog: [],
            Todo: [],
            Inprogress: [],
            Done: [],
            Canceled: []
        };
        const priorityMapping = {
            '4': 'Urgent',
            '3': 'High',
            '2': 'Medium',
            '1': 'Low',
            '0': 'No priority'
        };

        if (option === 'status') {
            Object.keys(groupedTickets).forEach(column => {
                groupedTickets[column] = [];
            });

            tickets.forEach(ticket => {

                ticket.status = ticket.status.split(" ").join("");
                if (groupedTickets[ticket.status]) {
                    groupedTickets[ticket.status].push(ticket);
                }
            });



            return groupedTickets;

        } else if (option === 'user') {
            const groupedByUser = tickets.reduce((groups, ticket) => {
                const user = users.find(user => user.id === ticket.userId);
                if (user) {
                    const userName = user.name;
                    if (!groups[userName]) {
                        groups[userName] = [];
                    }
                    groups[userName].push(ticket);
                }
                return groups;
            }, {});
            return groupedByUser;
        } else if (option === 'priority') {
            const groupedByPriority = tickets.reduce((groups, ticket) => {
                const priority = ticket.priority;
                if (!groups[priority]) {
                    groups[priority] = [];
                }
                groups[priority].push(ticket);
                return groups;
            }, {});
            return groupedByPriority;
        }
        return {};
    };

    const sortTickets = (groupedTickets, option) => {
        const sortedTickets = Object.keys(groupedTickets).reduce((sorted, groupKey) => {
            const group = groupedTickets[groupKey];
            if (option === 'priority') {
                sorted[groupKey] = group.sort((a, b) => b.priority - a.priority);
            } else if (option === 'title') {
                sorted[groupKey] = group.sort((a, b) => a.title.localeCompare(b.title));
            }
            return sorted;
        }, {});
        return sortedTickets;
    };

    const groupedTickets = groupTickets(tickets, groupingOption);
    const sortedTickets = sortTickets(groupedTickets, sortingOption);

    const renderTickets = groupedTickets => {
        return (
            <div className="kanban_board">

                {Object.keys(groupedTickets).map(groupKey => (
                    <div className='board-columns'>
                        <div key={groupKey} className="ticket_column">
                            
                            <p id='grpkey'>{groupKey === 'Inprogress' ? 'In Progress' : groupKey === '4' ? 'Urgent' :
                                groupKey === '3' ? 'High' :
                                groupKey === '2' ? 'Medium' :
                                groupKey === '1' ? 'Low' : groupKey === '0' ? 'No priority': groupKey
                            }</p>
                            {groupedTickets[groupKey].map(ticket => (
                                <div key={ticket.id} className="ticket">
                                    <div className='nameflex'>
                                        <p id='tickid'>{ticket.id}</p>
                                        {users.find(user => user.id === ticket.userId) && (<p>{users.find(user => user.id === ticket.userId).name}</p>)}
                                    </div>

                                    <p id='titlee'>{ticket.title}</p>
                                    <div className='namef'>
                                        <p id='tagsa'>...</p>
                                        <p id='tagss'> {ticket.tag}</p>
                                        
                                    </div>
                                    


                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        );
    };

    return (
        <div className="nav">
            <div className='Displayopt'>
                <div className='optclass'>
                    <label id='optionbutton' onClick={handleShowOption}>Display</label>
                </div>
                <div className={`optionss ${showOption && "active"}`}>
                    <div className='actopt'>
                        <label>Grouping</label>
                        <select className='rightside' value={groupingOption} onChange={e => setGroupingOption(e.target.value)}>
                            <option value="status">Status</option>
                            <option value="user">User</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>
                    <div className='actopt'>
                        <label>Sorting</label>
                        <select className='rightside' value={sortingOption} onChange={e => setSortingOption(e.target.value)}>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='ticketbody'>
                {renderTickets(sortedTickets)}
            </div>
        </div>
    );
}

export default Kanban;
