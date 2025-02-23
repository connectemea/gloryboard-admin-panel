import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Calendar, CalendarCog, CalendarPlus, SquareUserRound, Star, Telescope, Users, Settings, LogOut, ChartColumnBig, ChartArea, WandSparkles } from 'lucide-react';
import { AuthContext } from '@/context/authContext';
import ProductLogo from '@/assets/p_logo.svg';
import { getZoneDetails } from '@/utils/configZone';
// import Logo from '@/assets/logo.svg';

const routes = [
    {
        title: "Participants",
        url: "/participants",
        icon: Users
    },
    {
        title: "Schedule Overlap",
        url: "/schedule-overlap",
        role: "admin",
        icon: WandSparkles
    },
    {
        title: "Results",
        url: "/results",
        role: "admin",
        icon: Star
    },
    {
        title: "Score Table",
        url: "/score-table",
        role: "admin",
        icon: Telescope
    },
    {
        title: "College",
        url: "/college",
        icon: SquareUserRound,
        role: "admin"
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        role: "admin"
    },
    {
        title: "Events",
        url: "/events",
        groupLabel: "Event Management",
        children: [
            {
                title: "All Events",
                url: "/events",
                icon: Calendar,
                role: "admin"
            },
            {
                title: "Event Types",
                url: "/event/type",
                icon: CalendarCog,
                role: "admin"
            },
            {
                title: "Registration",
                url: "/event/registration",
                icon: CalendarPlus
            }
        ]
    },
    {
        title: "Registrations Counts",
        groupLabel: "Registrations Counts",
        children: [
            {
                title: "Participants",
                url: "/registration-count",
                icon: ChartColumnBig,
                role: "admin"
            },
            {
                title: "Events",
                url: "/event-count",
                icon: ChartArea,
                role: "admin"
            }
        ]
    },
];

const DashboardLayout = ({ children }) => {
    const location = useLocation();
    const { logout, auth } = useContext(AuthContext);

    const zoneDetails = getZoneDetails();

    // Helper function to filter routes, including nested ones
    const filterRoutes = (routes) => {
        return routes
            .map((route) => {
                if (route.children) {
                    const filteredChildren = filterRoutes(route.children);
                    if (filteredChildren.length > 0) {
                        return { ...route, children: filteredChildren };
                    }
                    return null;
                }
                if (route.role && route.role !== auth.user.user_type) {
                    return null;
                }
                return route;
            })
            .filter(Boolean); // Remove null values
    };

    const filteredRoutes = filterRoutes(routes);

    const renderMenuItem = (item) => (
        <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild>
                <a
                    href={item.url}
                    className={`flex items-center  hover:!bg-accent/80 space-x-2 px-4 py-2 my-[2px] rounded-lg ${location.pathname === item.url ? 'bg-accent' : 'text-white'
                        }`}
                >
                    <item.icon />
                    <span>{item.title}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );

    const renderMenuGroup = (route) => {
        if (route.children) {
            return (
                <SidebarGroup key={route.url || route.groupLabel}>
                    <SidebarGroupLabel className="text-white/70">{route.groupLabel}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {route.children.map((child) => renderMenuItem(child))}
                    </SidebarGroupContent>
                </SidebarGroup>
            );
        }
        return renderMenuItem(route);
    };

    return (
        <>
            <SidebarProvider>
                <div className="flex h-screen w-full">
                    <Sidebar className="z-50 ">
                        <SidebarHeader className="z-50">
                            <div className="px-4 py-2 text-center z-50">
                                <h3 className="text-lg font-medium leading-none py-2">
                                    <img src={zoneDetails?.logo} alt="Logo" className="h-10 mx-auto" />
                                    {/* C Zone */}
                                </h3>
                            </div>
                        </SidebarHeader>
                        <SidebarContent className="px-4 z-50">
                            <SidebarMenu>
                                {filteredRoutes.map((route) => renderMenuGroup(route))}
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter className="z-50">
                            <div className="absolute bottom-0 left-0 right-0 mx-auto flex justify-center">
                                <a href="https://www.instagram.com/gloryboard_/" target='_blank' >
                                <img src={ProductLogo} alt="Logo" className="h-12 mt-2" />
                                </a>
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    {/* Main Content */}
                    <div className="flex-1 flex-grow h-screen overflow-y-hidden">
                        <div className="border-b shadow sticky top-0 z-40 bg-background">
                            <div className="container mx-auto py-4 flex justify-between px-6 items-center">
                                <SidebarTrigger />
                                <div className="flex items-center space-x-4 z-40">
                                    <span className="font-medium opacity-50 leading-none">{auth.user.name}</span>
                                    <Avatar>
                                        <AvatarImage src="/profile.jpg" alt="Profile" />
                                        <AvatarFallback>{getAvatarFallback(auth.user.name)}</AvatarFallback>
                                    </Avatar>
                                    <Button variant="secondary" className="hover:bg-red-600" onClick={logout}>
                                        <LogOut />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="container mx-auto py-2 h-full ">
                            <div className="z-30 relative p-2 h-full">
                                <Outlet />
                            </div>
                            <div className='fixed w-full flex min-h-screen flex-col justify-between top-0 bottom-0 z-0 opacity-30 animate-pulse'>
                                <div className='relative w-full z-0'>
                                    <div className='rounded-full w-72 h-48 z-0 bg-[lightGray] blur-[115px] absolute top-20 right-[400px] opacity-30' />
                                </div>
                                <div className='relative w-full z-0'>
                                    <div className='rounded-full w-48 h-48 bg-[lightGray] blur-[115px] absolute left-0 bottom-0 opacity-30' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
};

export default DashboardLayout;

const getAvatarFallback = (value) => {
    return value.substring(0, 2).toUpperCase();
};
