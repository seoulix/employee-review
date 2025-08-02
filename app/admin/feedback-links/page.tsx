"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Copy, RefreshCw, ExternalLink, QrCode, LinkIcon, QrCodeIcon, Cross, X, Plus, Import, Timer, TimerIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { QRCode } from "qrcode"
import  QRCode  from "qrcode"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMainContext } from "@/app/context/mainContext"
import { useLoading } from "@/contexts/LoadingContext"
interface FeedbackLink {
  id: number
  outlet: string
  brand: string
  city: string
  state: string
  token: string
  url: string
  status: "Active" | "Inactive"
  createdAt: string
  lastUsed: string
  // totalSubmissions: number
}

export default function FeedbackLinksPage() {
  const { toast } = useToast()
  const { showLoading, hideLoading, showToast } = useLoading()
  const [feedbackLinks, setFeedbackLinks] = useState<FeedbackLink[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [qrUrl, setQrUrl] = useState<Base64URLString>()
  const [showQr, setShowQr] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [outlets, setOutlets] = useState<any[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [showSheetId,setShowSheetId] = useState(false);
  function generateQRCode(text:string) {
    QRCode.toDataURL(text, function (err, url:Base64URLString) {
      if (err) return console.error(err);
      setQrUrl(url)// This is a base64 string you can embed in <img>
      setShowQr(true);
    });
  }
  const {expiryTime,updateExpiryTime,setExpiryTime} = useMainContext();
  // Fetch feedback links
  const getFeedbackLinks = async () => {
    try {
      const response = await fetch("/api/feedback-links");
      const json = await response.json();
      if (json.success) {
        setFeedbackLinks(json.data);
      }
    } catch (error) {
      console.error("Error fetching feedback links:", error);
    }
  };


  const importSheetFeedbacks=async ()=>{
    showLoading("Importing feedback data...");
    
    try {
      // Implement the API and that will done all the things
      const res = await fetch("/api/google-sheet");
      const json = await res.json();
      if(json.success){
        setFeedbackLinks(json.data);
        hideLoading();
        showToast("Feedback data imported successfully!", "success");
      }else{
        hideLoading();
        showToast(json.message || "Failed to import feedback data", "error");
      }
    } catch (error) {
      console.error('Import error:', error);
      hideLoading();
      showToast("Failed to import feedback data", "error");
    }
  }

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const json = await res.json();
      if (json.success) {
        setBrands(json.data); // Adjust as per your API response
      }
    } catch (e) {
      // handle error
    }
  };

  useEffect(() => {
    getFeedbackLinks();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!selectedBrand) {
      setOutlets([]);
      setSelectedOutlet('');
      return;
    }
    const fetchOutlets = async () => {
      try {
        const res = await fetch(`/api/outlets?brand=${selectedBrand}`);
        const json = await res.json();
        if (json.success) {
          setOutlets(json.data); // Adjust as per your API response
        }
      } catch (e) {
        // handle error
      }
    };
    fetchOutlets();
  }, [selectedBrand]);

  const filteredLinks = feedbackLinks.filter(
    (link) =>
      link.outlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generateNewToken = async (id: number) => {
    showLoading("Regenerating token...");
    
    try {
      const response = await fetch(`/api/feedback-links/${id}/regenerate`, {
        method: 'POST'
      });
      const json = await response.json();
      if (json.success) {
        getFeedbackLinks(); // Refresh the list
        hideLoading();
        showToast("Token regenerated successfully!", "success");
      } else {
        hideLoading();
        showToast(json.message || "Failed to regenerate token", "error");
      }
    } catch (error) {
      console.error('Error:', error);
      hideLoading();
      showToast("An error occurred while regenerating token", "error");
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Feedback link has been copied to clipboard.",
    })
  }

  // const toggleStatus = async (id: number) => {
  //   try {
  //     const link = feedbackLinks.find(l => l.id === id);
  //     if (!link) return;

  //     const newStatus = link.status === "Active" ? "Inactive" : "Active";
  //     const response = await fetch(`/api/feedback-links/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ status: newStatus })
  //     });
  //     const json = await response.json();
  //     if (json.success) {
  //       getFeedbackLinks(); // Refresh the list
  //       toast({
  //         title: "Status Updated",
  //         description: `Feedback link status changed to ${newStatus}`,
  //       });
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: json.message || "Failed to update status",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     toast({
  //       title: "Error",
  //       description: "An error occurred while updating status",
  //       variant: "destructive",
  //     });
  //   }
  // }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Feedback Links</h1>
          <div>

          <Button onMouseEnter={() => setShowSheetId(true)} onMouseLeave={()=> setShowSheetId(false)} className="mr-5 relative" style={{borderRadius: "var(--border-radius)"}} onClick={importSheetFeedbacks}>
           {showSheetId && <span className="absolute text-black dark:text-white -top-5 left-50 right-50">You Can find the sheet Id in Settings</span>}
            <Import className="mr-2 h-4 w-4" />
Import the Feedback Links from Google Sheet          </Button>
          <Button  style={{borderRadius: "var(--border-radius)"}} onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feedback Link
          </Button>
          </div>
        </div>

        <Card  style={{borderRadius: "var(--border-radius)"}}>
          <CardHeader>
            <CardTitle>Outlet Feedback Links</CardTitle>
            <div className="flex items-center justify-between space-x-2">
              <div className="relative flex-2 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search outlets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="relative flex-1 max-w-sm flex space-x-2">
              <TimerIcon className="absolute left-4 top-2.5 h-4 w-8 text-muted-foreground" />
              <Input
                type="number"
                  placeholder="Set Form Expiry Time"
                  value={expiryTime.value}
                  onChange={(e) => setExpiryTime({...expiryTime,value:parseInt(e.target.value)})}
                  className="pl-8"
                  disabled={expiryTime.format==="Never"}
                /> 
                  <Select
                 value={expiryTime.format}
                 onValueChange={(value) => setExpiryTime({ ...expiryTime, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minute">Minute</SelectItem>
                    <SelectItem value="Hour">Hour</SelectItem>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Never">No Expiry Time</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={()=>updateExpiryTime()}>Update</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outlet Details</TableHead>
                  <TableHead>Feedback Link</TableHead>
                  <TableHead>Usage Stats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{link.outlet}</div>
                        <div className="text-sm text-gray-500">{link.brand}</div>
                        <div className="text-sm text-gray-500">
                          {link.city}, {link.state}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 dark:text-black px-2 py-1 rounded text-sm"  style={{borderRadius: "var(--border-radius)"}}>{link.token}</code>
                          <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={() => copyToClipboard(link.token)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-blue-600 truncate max-w-xs">{link.url || window.location.origin+"/outlet/feedback/"+link.token}</span>
                          <Button  style={{borderRadius: "var(--border-radius)"}} variant="ghost" size="sm" onClick={() => copyToClipboard(link.url?link.url:window.location.origin+"/outlet/feedback/"+link.token)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">Status: {link.status==="Active"?"Not Submitted":"Submitted"}</div>
                        <div className="text-sm text-gray-500">Last used: {link.lastUsed}</div>
                        <div className="text-sm text-gray-500">Created: {link.createdAt}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={link.status === "Active" ? "default" : "secondary"}
                        className="cursor-pointer text-white dark:text-black bg-black dark:bg-white dark:border-black"
                        // onClick={() => toggleStatus(link.id)}
                      >
                        {link.status==="Active"?"Pending":"Submitted"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button  style={{borderRadius: "var(--border-radius)"}}  size="sm" onClick={() => window.open(link.url?link.url:window.location.origin+"/outlet/feedback/"+link.token, "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        {/* <Button  style={{borderRadius: "var(--border-radius)"}}  size="sm"  onClick={() => generateNewToken(link.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button> */}
<Dialog open={showQr} onOpenChange={setShowQr}>
            <DialogTrigger asChild>
              <Button  style={{borderRadius: "var(--border-radius)"}}  size="sm"  onClick={()=>{generateQRCode(link.url)}}>
                <QrCodeIcon className="h-4 w-4" />
             </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader >
              Scan to Visit Feedback From
              </DialogHeader>
          <img src={qrUrl} alt="Qr Code for the link" className="w-full"/>
         
            </DialogContent>
            
          </Dialog>
                      </div>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Total Active Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {feedbackLinks.filter((link) => link.status === "Active").length}
              </div>
              <p className="text-sm text-gray-500">Out of {feedbackLinks.length} total links</p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {feedbackLinks.reduce((sum, link) => sum + link.totalSubmissions, 0)}
              </div>
              <p className="text-sm text-gray-500">Across all outlets</p>
            </CardContent>
          </Card>

          <Card  style={{borderRadius: "var(--border-radius)"}}>
            <CardHeader>
              <CardTitle className="text-lg">Average per Outlet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(feedbackLinks.reduce((sum, link) => sum + link.totalSubmissions, 0) / feedbackLinks.length)}
              </div>
              <p className="text-sm text-gray-500">Submissions per outlet</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Feedback Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="brand">Select Brand</Label>
            <select
              id="brand"
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full border rounded p-2 text-black dark:text-white"  style={{borderRadius: "var(--border-radius)"}}
            >
              <option className="text-black dark:text-white" value="">-- Select Brand --</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>

            <Label htmlFor="outlet">Select Outlet</Label>
            <select
              id="outlet"
              value={selectedOutlet}
              onChange={e => setSelectedOutlet(e.target.value)}
              className="w-full border rounded p-2"
              disabled={!selectedBrand}
              style={{borderRadius: "var(--border-radius)"}}
            >
              <option value="">-- Select Outlet --</option>
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button  style={{borderRadius: "var(--border-radius)"}}
              onClick={async () => {
                if (!selectedOutlet) {
                  toast({ title: "Select an outlet", variant: "destructive" });
                  return;
                }
                // Call API to create link
                const res = await fetch('/api/feedback-links', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ outletId: selectedOutlet }),
                });
                const json = await res.json();
                if (json.success) {
                  toast({ title: "Feedback link created" });
                  setShowAddDialog(false);
                  setSelectedBrand('');
                  setSelectedOutlet('');
                  getFeedbackLinks();
                } else {
                  toast({ title: "Error", description: json.message, variant: "destructive" });
                }
              }}
            >
              Create Link
            </Button>
            <Button  style={{borderRadius: "var(--border-radius)"}} variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
