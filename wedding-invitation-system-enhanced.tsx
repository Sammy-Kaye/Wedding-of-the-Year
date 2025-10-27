import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Download, CheckCircle, Search, Users, UserCheck, QrCode, AlertTriangle, RefreshCw, X, FileText, Shield, Eye, XCircle, Info } from 'lucide-react';
import QRCodeLib from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { storage } from './src/storage';

// Toast Notification Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const typeClasses = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: 'toast-info'
  };

  return (
    <div className={`toast ${typeClasses[type]} flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <p className="font-medium text-sm leading-relaxed">{message}</p>
      </div>
      <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Types
interface Guest {
  id: number;
  name: string;
  partySize: number;
  searchTerms: string[];
}

interface RSVPData {
  guestId: number;
  name: string;
  partySize: number;
  code: string;
  attending: boolean;
  rsvped: boolean;
  rsvpTimestamp: string;
  checkedIn: boolean;
  checkInTimestamp: string | null;
}

interface CheckInResult {
  success: boolean;
  message: string;
  guest?: RSVPData;
}

interface FraudAttempt {
  code: string;
  timestamp: string;
  type: string;
}

// Guest list data
const GUEST_LIST: Guest[] = [
  // Groom's side - Singles
  { id: 1, name: "Narcisse", partySize: 1, searchTerms: ["narcisse"] },
  { id: 2, name: "Jemima", partySize: 1, searchTerms: ["jemima"] },
  { id: 3, name: "Anella Tshilumba", partySize: 1, searchTerms: ["anella", "tshilumba"] },
  { id: 4, name: "Ammielle Ngombe", partySize: 1, searchTerms: ["ammielle", "ngombe"] },
  { id: 5, name: "Grace Mangi", partySize: 1, searchTerms: ["grace", "mangi"] },
  { id: 10, name: "Samuel Kalongo", partySize: 1, searchTerms: ["samuel", "kalongo"] },
  { id: 11, name: "Michel Kalongo", partySize: 1, searchTerms: ["michel", "kalongo"] },
  { id: 12, name: "Marilyn Kalongo", partySize: 1, searchTerms: ["marilyn", "kalongo"] },
  { id: 13, name: "Tantine Esther Kanyanya", partySize: 1, searchTerms: ["esther", "kanyanya", "tantine"] },
  { id: 14, name: "Joshua Lokamba", partySize: 1, searchTerms: ["joshua", "lokamba"] },
  { id: 15, name: "Rachel Lokamba", partySize: 1, searchTerms: ["rachel", "lokamba"] },
  { id: 16, name: "Guy Kubelua", partySize: 1, searchTerms: ["guy", "kubelua"] },
  { id: 17, name: "Priscille Kubelua", partySize: 1, searchTerms: ["priscille", "kubelua"] },
  { id: 18, name: "Ya Floride Mulamba", partySize: 1, searchTerms: ["floride", "mulamba"] },
  { id: 19, name: "Frere Pascal Kalala", partySize: 1, searchTerms: ["pascal", "kalala", "frere"] },
  { id: 20, name: "Sister Esther Murula", partySize: 1, searchTerms: ["esther", "murula", "sister"] },
  { id: 21, name: "Fr Chance Murula", partySize: 1, searchTerms: ["chance", "murula"] },
  { id: 24, name: "Arthur Kalenga", partySize: 1, searchTerms: ["arthur", "kalenga"] },
  { id: 25, name: "Laura Kalenga", partySize: 1, searchTerms: ["laura", "kalenga"] },
  { id: 26, name: "Tonton Emile Kitenge", partySize: 1, searchTerms: ["emile", "kitenge", "tonton"] },
  { id: 31, name: "Sharon Mbiye", partySize: 1, searchTerms: ["sharon", "mbiye"] },
  { id: 32, name: "Shekinah Mbiye", partySize: 1, searchTerms: ["shekinah", "mbiye"] },
  { id: 35, name: "Tantine Doudou Mulumba", partySize: 1, searchTerms: ["doudou", "mulumba", "tantine"] },
  { id: 36, name: "Jemima Mulumba", partySize: 1, searchTerms: ["jemima", "mulumba"] },
  { id: 37, name: "Jude Mulumba", partySize: 1, searchTerms: ["jude", "mulumba"] },
  { id: 38, name: "Nathan Mulumba", partySize: 1, searchTerms: ["nathan", "mulumba"] },
  { id: 39, name: "Emerance Musau", partySize: 1, searchTerms: ["emerance", "musau"] },
  { id: 40, name: "Fr Jermain Mbuyu", partySize: 1, searchTerms: ["jermain", "mbuyu"] },
  { id: 41, name: "Da Nicole Mbuyu", partySize: 1, searchTerms: ["nicole", "mbuyu"] },
  { id: 42, name: "Narcisse Mbuyu", partySize: 1, searchTerms: ["narcisse", "mbuyu"] },
  { id: 43, name: "Fr Tharcisse Ntunka", partySize: 1, searchTerms: ["tharcisse", "ntunka"] },
  { id: 44, name: "Da Cathy Ntunka", partySize: 1, searchTerms: ["cathy", "ntunka"] },
  { id: 45, name: "Nzuzo Mthabela", partySize: 1, searchTerms: ["nzuzo", "mthabela"] },
  { id: 46, name: "Teveshan Valaitham", partySize: 1, searchTerms: ["teveshan", "valaitham"] },
  { id: 47, name: "Ayanda Khumalo", partySize: 1, searchTerms: ["ayanda", "khumalo"] },
  { id: 50, name: "Charlie Lubanza", partySize: 1, searchTerms: ["charlie", "lubanza"] },
  { id: 51, name: "Divine Nsenga", partySize: 1, searchTerms: ["divine", "nsenga"] },

  // Groom's side - Couples
  { id: 100, name: "Nicolas & Anella Tshilumba", partySize: 2, searchTerms: ["nicolas", "anella", "tshilumba"] },
  { id: 101, name: "Danny & Deborah Mulamba", partySize: 2, searchTerms: ["danny", "deborah", "mulamba"] },
  { id: 102, name: "Polly & Annie Mangi", partySize: 2, searchTerms: ["polly", "annie", "mangi"] },
  { id: 103, name: "Nico & Thethe Kalongo", partySize: 2, searchTerms: ["nico", "thethe", "kalongo"] },
  { id: 104, name: "Christophe & Betty Kalenga", partySize: 2, searchTerms: ["christophe", "betty", "kalenga"] },
  { id: 105, name: "Martin & Henriette Kasongo", partySize: 2, searchTerms: ["martin", "henriette", "kasongo"] },
  { id: 106, name: "Emma & Gertrude Mbiye", partySize: 2, searchTerms: ["emma", "gertrude", "mbiye"] },
  { id: 107, name: "Faustin & Vicky Lugoma", partySize: 2, searchTerms: ["faustin", "vicky", "lugoma"] },
  { id: 108, name: "Jean-luc Kadima", partySize: 2, searchTerms: ["jean", "luc", "kadima", "jeanluc"] },
  { id: 109, name: "Papa Mbayo Muyembe", partySize: 2, searchTerms: ["mbayo", "muyembe", "papa"] },
  { id: 110, name: "Fr Serge Kalenga", partySize: 2, searchTerms: ["serge", "kalenga"] },
  { id: 111, name: "Joshua & Sansha Haripersadh", partySize: 2, searchTerms: ["joshua", "sansha", "haripersadh"] },
  { id: 112, name: "Laurent & Patou Mbiya", partySize: 2, searchTerms: ["laurent", "patou", "mbiya"] },
  { id: 113, name: "Kevin Muya & Francis Kayamba", partySize: 2, searchTerms: ["kevin", "muya", "francis", "kayamba"] },
  { id: 114, name: "Vivi & Papa Lubanza", partySize: 2, searchTerms: ["vivi", "lubanza", "papa"] },
  { id: 115, name: "Patrick & Anita Kalonji", partySize: 2, searchTerms: ["patrick", "anita", "kalonji"] },
  { id: 116, name: "Olivier & Deddy Odia", partySize: 2, searchTerms: ["olivier", "deddy", "odia"] },
  { id: 117, name: "Donat & Julia Kahutu", partySize: 2, searchTerms: ["donat", "julia", "kahutu"] },
  { id: 118, name: "Emmanuel & Nono Kalambay", partySize: 2, searchTerms: ["emmanuel", "nono", "kalambay"] },
  { id: 119, name: "Paul Kalambay", partySize: 2, searchTerms: ["paul", "kalambay"] },
  { id: 120, name: "Ceasar & Rozi Mukuna", partySize: 2, searchTerms: ["ceasar", "rozi", "mukuna"] },
  { id: 121, name: "Mikyle Pillay", partySize: 2, searchTerms: ["mikyle", "pillay"] },
  { id: 122, name: "Leonard Kadima & Mwa Mbuyi", partySize: 2, searchTerms: ["leonard", "kadima", "mwa", "mbuyi"] },

  // Bride's side
  { id: 200, name: "Soeur Monique Mulanga", partySize: 1, searchTerms: ["monique", "mulanga", "soeur"] },
  { id: 201, name: "Soeur Keren Mulanga", partySize: 1, searchTerms: ["keren", "mulanga", "soeur"] },
  { id: 202, name: "Couple Kangudia", partySize: 2, searchTerms: ["kangudia"] },
  { id: 203, name: "Frere Jevic", partySize: 1, searchTerms: ["jevic", "frere"] },
  { id: 204, name: "Couple Mukeninay", partySize: 2, searchTerms: ["mukeninay"] },
  { id: 205, name: "Couple Kayembe", partySize: 2, searchTerms: ["kayembe"] },
  { id: 206, name: "Couple Andre Kadima", partySize: 2, searchTerms: ["andre", "kadima"] },
  { id: 207, name: "Couple Tubadi", partySize: 2, searchTerms: ["tubadi"] },
  { id: 208, name: "Soeur Christell Bilonda", partySize: 1, searchTerms: ["christell", "bilonda", "soeur"] },
  { id: 209, name: "Mwa Ndaya Beya", partySize: 1, searchTerms: ["ndaya", "beya", "mwa"] },
  { id: 210, name: "Soeur Kasy", partySize: 1, searchTerms: ["kasy", "soeur"] },
  { id: 211, name: "Soeur Mbuyi", partySize: 1, searchTerms: ["mbuyi", "soeur"] },
  { id: 212, name: "Soeur Thamar", partySize: 1, searchTerms: ["thamar", "soeur"] },
  { id: 213, name: "Couple Philipe Ngoma", partySize: 2, searchTerms: ["philipe", "ngoma"] },
  { id: 214, name: "Soeur Gabriela", partySize: 1, searchTerms: ["gabriela", "soeur"] },
  { id: 215, name: "Soeur Sephora", partySize: 1, searchTerms: ["sephora", "soeur"] },
  { id: 216, name: "Soeur Eunice", partySize: 1, searchTerms: ["eunice", "soeur"] },
  { id: 217, name: "Soeur Keren", partySize: 1, searchTerms: ["keren", "soeur"] },
  { id: 218, name: "Soeur Christelle", partySize: 1, searchTerms: ["christelle", "soeur"] },
  { id: 219, name: "Soeur Christella", partySize: 1, searchTerms: ["christella", "soeur"] },
  { id: 220, name: "Soeur Hadassa", partySize: 1, searchTerms: ["hadassa", "soeur"] },
  { id: 221, name: "Couple Madi", partySize: 2, searchTerms: ["madi"] },
  { id: 222, name: "Couple Kalonji", partySize: 2, searchTerms: ["kalonji"] },
  { id: 223, name: "Couple Kanda", partySize: 2, searchTerms: ["kanda"] },
  { id: 224, name: "Seour Jael Kalonji", partySize: 1, searchTerms: ["jael", "kalonji", "seour"] },
  { id: 225, name: "Couple Phinees Ngoie", partySize: 2, searchTerms: ["phinees", "ngoie"] },
  { id: 226, name: "Couple Joel Mukuna", partySize: 2, searchTerms: ["joel", "mukuna"] },
  { id: 227, name: "Couple Adonis Ngoie", partySize: 2, searchTerms: ["adonis", "ngoie"] },
  { id: 228, name: "Couple Seraphin Ngoie", partySize: 2, searchTerms: ["seraphin", "ngoie"] },
  { id: 229, name: "Couple Ekaka Kangudia", partySize: 2, searchTerms: ["ekaka", "kangudia"] },
  { id: 230, name: "Couple Kalala (Lice)", partySize: 2, searchTerms: ["kalala", "lice"] },
  { id: 231, name: "Seour Christelle Nsenga", partySize: 1, searchTerms: ["christelle", "nsenga", "seour"] },
  { id: 232, name: "Couple Leonard Kayembe", partySize: 2, searchTerms: ["leonard", "kayembe"] },
  { id: 233, name: "Couple Tumba", partySize: 2, searchTerms: ["tumba"] },
  { id: 234, name: "Couple Mulongoy", partySize: 2, searchTerms: ["mulongoy"] },
  { id: 235, name: "Couple Marc Tshibwabwa", partySize: 2, searchTerms: ["marc", "tshibwabwa"] },
  { id: 236, name: "Couple Ilunga", partySize: 2, searchTerms: ["ilunga"] },
  { id: 237, name: "Soeur Debora Ekaka", partySize: 1, searchTerms: ["debora", "ekaka", "soeur"] },
  { id: 238, name: "Couple Danny Kabemba", partySize: 2, searchTerms: ["danny", "kabemba"] },
  { id: 239, name: "Soeur Harmony", partySize: 1, searchTerms: ["harmony", "soeur"] },
  { id: 240, name: "Soeur Dina", partySize: 1, searchTerms: ["dina", "soeur"] },
  { id: 241, name: "Couple Tshibangu (Chatty)", partySize: 2, searchTerms: ["tshibangu", "chatty"] },
  { id: 242, name: "Couple Christophe (Rachel)", partySize: 2, searchTerms: ["christophe", "rachel"] },
  { id: 243, name: "Soeur Dorcas", partySize: 1, searchTerms: ["dorcas", "soeur"] },
  { id: 244, name: "Soeur Chitalu", partySize: 1, searchTerms: ["chitalu", "soeur"] },
  { id: 245, name: "Couple Jonathan Kayembe", partySize: 2, searchTerms: ["jonathan", "kayembe"] },
  { id: 246, name: "Couple Kajingu (Sis bert)", partySize: 2, searchTerms: ["kajingu", "bert"] },
  { id: 247, name: "Couple Pathy Mukie", partySize: 2, searchTerms: ["pathy", "mukie"] },
  { id: 248, name: "Couple Henoch", partySize: 2, searchTerms: ["henoch"] },
  { id: 249, name: "Couple Jean Kasemwana", partySize: 2, searchTerms: ["jean", "kasemwana"] },
  { id: 250, name: "Soeur Christen", partySize: 1, searchTerms: ["christen", "soeur"] },
  { id: 251, name: "Couple Guelord", partySize: 2, searchTerms: ["guelord"] },
  { id: 252, name: "Frere Jeff", partySize: 1, searchTerms: ["jeff", "frere"] },
  { id: 253, name: "Couple Danah", partySize: 2, searchTerms: ["danah"] },
  { id: 254, name: "Couple Bajay", partySize: 2, searchTerms: ["bajay"] },
  { id: 255, name: "Couple Papi", partySize: 2, searchTerms: ["papi"] },
  { id: 256, name: "Soeur Charlotte", partySize: 1, searchTerms: ["charlotte", "soeur"] },
  { id: 257, name: "Soeur Chichi", partySize: 1, searchTerms: ["chichi", "soeur"] },
  { id: 258, name: "Soeur Sara", partySize: 1, searchTerms: ["sara", "soeur"] },
  { id: 259, name: "Soeur Anne", partySize: 1, searchTerms: ["anne", "soeur"] },
  { id: 260, name: "Soeur Aime", partySize: 1, searchTerms: ["aime", "soeur"] },
  { id: 261, name: "Frere Marco Bope", partySize: 1, searchTerms: ["marco", "bope", "frere"] },
  { id: 262, name: "Frere Markus", partySize: 1, searchTerms: ["markus", "frere"] },
  { id: 263, name: "Couple Mukaya", partySize: 2, searchTerms: ["mukaya"] },
  { id: 264, name: "Soeur Sharon", partySize: 1, searchTerms: ["sharon", "soeur"] },
  { id: 265, name: "Frere Jean Matama", partySize: 1, searchTerms: ["jean", "matama", "frere"] },
  { id: 266, name: "Couple Kapenga", partySize: 2, searchTerms: ["kapenga"] },
  { id: 267, name: "Couple Kibambi", partySize: 2, searchTerms: ["kibambi"] },
  { id: 268, name: "Couple Bope", partySize: 2, searchTerms: ["bope"] },
  { id: 269, name: "Soeur Anacore", partySize: 1, searchTerms: ["anacore", "soeur"] },
  { id: 270, name: "Mama Bilonda", partySize: 1, searchTerms: ["bilonda", "mama"] },
  { id: 271, name: "Soeur Ruth Seth", partySize: 1, searchTerms: ["ruth", "seth", "soeur"] },
  { id: 272, name: "Soeur Dorcas (Mama Aime)", partySize: 1, searchTerms: ["dorcas", "aime", "mama", "soeur"] },
  { id: 273, name: "Couple Jean Paul Tshalanga", partySize: 2, searchTerms: ["jean", "paul", "tshalanga"] },
  { id: 274, name: "Couple Paul Ilunga", partySize: 2, searchTerms: ["paul", "ilunga"] },
];

const WeddingInvitationSystem = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<Record<number, RSVPData>>({});
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [checkInCode, setCheckInCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [fraudAttempts, setFraudAttempts] = useState<FraudAttempt[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadRsvpData();
  }, []);

  const loadRsvpData = async () => {
    try {
      const result = await storage.get('wedding-rsvps');
      if (result && result.value) {
        setRsvpStatus(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No existing RSVP data');
    }
  };

  const saveRsvpData = async (data: Record<number, RSVPData>) => {
    try {
      await storage.set('wedding-rsvps', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving RSVP data:', error);
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const query = searchQuery.toLowerCase();
      const matches = GUEST_LIST.filter(guest =>
        guest.searchTerms.some(term => term.includes(query))
      );
      setFilteredGuests(matches.slice(0, 5));
      
      // Show "not invited" message if no matches found after typing 3+ characters
      if (searchQuery.length >= 3 && matches.length === 0) {
        showToast(
          "We couldn't find your name on our guest list. If you believe this is an error, please contact the couple directly.",
          'warning'
        );
      }
    } else {
      setFilteredGuests([]);
    }
  }, [searchQuery]);

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generateQRCode = async (code: string) => {
    try {
      const qrUrl = await QRCodeLib.toDataURL(code, {
        width: 200,
        margin: 2,
        color: {
          dark: '#8B2332',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleRsvp = async (attending: boolean) => {
    if (!selectedGuest) return;

    const existingRsvp = rsvpStatus[selectedGuest.id];

    if (existingRsvp && existingRsvp.rsvped) {
      showToast('This guest has already RSVP\'d. If this wasn\'t you, please contact the couple immediately.', 'warning');
      return;
    }

    const code = generateCode();
    const timestamp = new Date().toISOString();

    const newRsvpData: RSVPData = {
      guestId: selectedGuest.id,
      name: selectedGuest.name,
      partySize: selectedGuest.partySize,
      code: code,
      attending: attending,
      rsvped: true,
      rsvpTimestamp: timestamp,
      checkedIn: false,
      checkInTimestamp: null
    };

    const updatedRsvpStatus = {
      ...rsvpStatus,
      [selectedGuest.id]: newRsvpData
    };

    setRsvpStatus(updatedRsvpStatus);
    await saveRsvpData(updatedRsvpStatus);

    if (attending) {
      setGeneratedCode(code);
      await generateQRCode(code);
      setCurrentPage('confirmation');
      showToast('Thank you! Your RSVP has been submitted successfully. We look forward to celebrating with you!', 'success');
    } else {
      showToast('Thank you for letting us know. You will be missed!', 'info');
      setSearchQuery('');
      setSelectedGuest(null);
      setCurrentPage('home');
    }
  };

  const downloadPDF = async () => {
    if (!selectedGuest || !generatedCode) return;

    try {
      // Create invitation element for PDF generation
      const invitationElement = document.createElement('div');
      invitationElement.style.width = '800px';
      invitationElement.style.height = '1000px';
      invitationElement.style.position = 'absolute';
      invitationElement.style.left = '-9999px';
      invitationElement.style.background = `linear-gradient(135deg, #8B2332 0%, #D4AF37 100%)`;
      invitationElement.style.display = 'flex';
      invitationElement.style.flexDirection = 'column';
      invitationElement.style.alignItems = 'center';
      invitationElement.style.justifyContent = 'center';
      invitationElement.style.fontFamily = 'serif';
      invitationElement.style.color = 'white';

      invitationElement.innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <div style="font-size: 60px; font-weight: bold; margin-bottom: 10px;">🕊️</div>
          <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">Narcisse & Jemima</div>
          <div style="font-size: 24px; font-style: italic; margin-bottom: 40px;">"Narce & His Dove"</div>

          <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; margin: 40px 0;">
            <div style="font-size: 32px; font-weight: bold; margin-bottom: 10px;">${selectedGuest.name}</div>
            <div style="font-size: 20px; margin-bottom: 30px;">Party of ${selectedGuest.partySize}</div>

            <div style="font-size: 64px; font-family: monospace; font-weight: bold; margin: 30px 0; letter-spacing: 8px;">${generatedCode}</div>
            <div style="font-size: 18px; margin-bottom: 30px;">Your Unique Access Code</div>
          </div>

          <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">Tuesday, December 16, 2025</div>
          <div style="font-size: 20px; margin-bottom: 10px;">09:00 AM</div>
          <div style="font-size: 18px; margin-bottom: 30px;">Plot 16, N14 & Steyn Rd<br>Krugersdorp</div>

          <div style="font-size: 16px; font-weight: bold; margin: 20px 0;">Dress Code: Formal Attire</div>

          <div style="font-size: 14px; margin-top: 40px; opacity: 0.8;">
            This invitation is non-transferable<br>
            Please present this code at the venue entrance
          </div>
        </div>
      `;

      document.body.appendChild(invitationElement);

      const canvas = await html2canvas(invitationElement, {
        width: 800,
        height: 1000,
        scale: 2,
        backgroundColor: '#8B2332'
      });

      document.body.removeChild(invitationElement);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Wedding_Invitation_${selectedGuest.name.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error generating PDF. Please try again.', 'error');
    }
  };

  const handleCheckIn = async () => {
    const guest = Object.values(rsvpStatus).find((g) => (g as RSVPData).code === checkInCode);

    if (!guest) {
      const fraudAttempt: FraudAttempt = {
        code: checkInCode,
        timestamp: new Date().toISOString(),
        type: 'invalid_code'
      };
      setFraudAttempts(prev => [...prev, fraudAttempt]);
      setCheckInResult({ success: false, message: 'Invalid code. Guest not found.' });
      showToast('Invalid invitation code. Please check your code and try again, or contact the couple for assistance.', 'error');
      return;
    }

    if (!guest.attending) {
      setCheckInResult({ success: false, message: 'This guest declined the invitation.' });
      showToast('This guest has declined the invitation.', 'warning');
      return;
    }

    if (guest.checkedIn) {
      setCheckInResult({
        success: false,
        message: `Already checked in at ${new Date(guest.checkInTimestamp!).toLocaleTimeString()}`,
        guest: guest
      });
      showToast('This guest has already been checked in. Please see an attendant if you need assistance.', 'warning');
      return;
    }

    const updatedRsvpData = {
      ...rsvpStatus,
      [guest.guestId]: {
        ...guest,
        checkedIn: true,
        checkInTimestamp: new Date().toISOString()
      }
    };

    setRsvpStatus(updatedRsvpData);
    await saveRsvpData(updatedRsvpData);

    setCheckInResult({
      success: true,
      message: 'Successfully checked in!',
      guest: { ...guest, checkedIn: true }
    });
    showToast(`Welcome! ${guest.name} has been checked in successfully.`, 'success');
  };

  const resetGuestRSVP = async (guestId: number) => {
    // Simple confirmation without browser confirm dialog
    const updatedRsvpStatus = { ...rsvpStatus };
    delete updatedRsvpStatus[guestId];
    setRsvpStatus(updatedRsvpStatus);
    await saveRsvpData(updatedRsvpStatus);
    showToast('RSVP reset successfully.', 'success');
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'narce&jemima2025') {
      setIsAdminAuthenticated(true);
      showToast('Welcome! You are now logged in as admin.', 'success');
    } else {
      showToast('Incorrect password. Please try again.', 'error');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(rsvpStatus, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `wedding-rsvp-data-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStats = () => {
    const rsvps = Object.values(rsvpStatus) as RSVPData[];
    const totalGuests = GUEST_LIST.reduce((sum, g) => sum + g.partySize, 0);
    const rsvpedYes = rsvps.filter(r => r.attending).reduce((sum, r) => sum + r.partySize, 0);
    const rsvpedNo = rsvps.filter(r => !r.attending).reduce((sum, r) => sum + r.partySize, 0);
    const checkedIn = rsvps.filter(r => r.checkedIn).reduce((sum, r) => sum + r.partySize, 0);

    return {
      totalGuests,
      rsvpedYes,
      rsvpedNo,
      checkedIn,
      pending: totalGuests - rsvpedYes - rsvpedNo
    };
  };

  // HomePage
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn">
          <div className="text-center mb-12">
            <div className="text-6xl mb-4 animate-float">🕊️</div>
            <h1 className="text-6xl font-serif text-rose-900 mb-2 gradient-text">Narcisse & Jemima</h1>
            <p className="text-2xl text-rose-700 italic mb-8">"Narce & His Dove"</p>

            <div className="w-full h-64 bg-gradient-to-br from-rose-200 to-amber-100 rounded-lg mb-8 flex items-center justify-center">
              <p className="text-rose-800 text-lg">[Couple Photo Placeholder]</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 elegant-card">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Calendar className="text-rose-700" />
                <p className="text-2xl text-gray-800">Tuesday, December 16, 2025</p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="text-rose-700" />
                <p className="text-xl text-gray-700">09:00 AM</p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <MapPin className="text-rose-700" />
                <p className="text-lg text-gray-600">Plot 16, N14 & Steyn Rd, Krugersdorp</p>
              </div>

              <div className="text-center mb-6">
                <p className="text-lg font-semibold text-rose-800 mb-2">Dress Code: Formal Attire</p>
                <p className="text-sm text-gray-600">RSVP by December 1, 2025</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('rsvp')}
                className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform"
              >
                <Heart className="inline-block mr-2" size={20} />
                RSVP Now
              </button>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setCurrentPage('checkin')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  Check In
                </button>

                <button
                  onClick={() => setCurrentPage('admin')}
                  className="bg-rose-800 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-rose-900 transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RSVP Page
  if (currentPage === 'rsvp') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-8 elegant-card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-rose-900 mb-2">RSVP</h2>
              <p className="text-gray-600">Please search for your name to RSVP</p>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for your name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {filteredGuests.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredGuests.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => {
                        setSelectedGuest(guest);
                        setFilteredGuests([]);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-rose-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-semibold text-gray-900">{guest.name}</div>
                      <div className="text-sm text-gray-600">Party of {guest.partySize}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedGuest && (
              <div className="bg-rose-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedGuest.name}</h3>
                    <p className="text-gray-600">Party of {selectedGuest.partySize}</p>
                  </div>
                  <button
                    onClick={() => setSelectedGuest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleRsvp(true)}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => handleRsvp(false)}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    ✗ Decline
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-rose-600 hover:text-rose-800 font-semibold"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Page
  if (currentPage === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-8 elegant-card">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-serif text-rose-900 mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">Your RSVP has been recorded successfully.</p>
            </div>

            {selectedGuest && (
              <div className="bg-rose-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedGuest.name}</h3>
                <p className="text-gray-600 mb-4">Party of {selectedGuest.partySize}</p>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-2">Your Unique Code:</div>
                  <div className="text-3xl font-mono font-bold text-rose-800 mb-2">{generatedCode}</div>
                  <div className="text-xs text-gray-500">Keep this code safe for venue entry</div>
                </div>

                {qrCodeUrl && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">QR Code for Quick Check-in:</div>
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto border rounded-lg" />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={downloadPDF}
                className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                Download PDF
              </button>

              <button
                onClick={() => {
                  setCurrentPage('home');
                  setSelectedGuest(null);
                  setGeneratedCode(null);
                  setQrCodeUrl('');
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check-in Page
  if (currentPage === 'checkin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-8 elegant-card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-rose-900 mb-2">Check In</h2>
              <p className="text-gray-600">Enter guest code to check in</p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter 6-digit code..."
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center text-2xl font-mono py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                maxLength={6}
              />
            </div>

            <div className="text-center mb-6">
              <button
                onClick={handleCheckIn}
                disabled={checkInCode.length !== 6}
                className="bg-rose-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Check In Guest
              </button>
            </div>

            {checkInResult && (
              <div className={`rounded-lg p-4 mb-6 ${checkInResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  {checkInResult.success ? (
                    <CheckCircle className="text-green-600" />
                  ) : (
                    <AlertTriangle className="text-red-600" />
                  )}
                  <p className={`font-semibold ${checkInResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {checkInResult.message}
                  </p>
                </div>

                {checkInResult.guest && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Guest:</strong> {checkInResult.guest.name}</p>
                    <p><strong>Party Size:</strong> {checkInResult.guest.partySize}</p>
                  </div>
                )}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-rose-600 hover:text-rose-800 font-semibold"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Login Page
  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
          <div className="max-w-md mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif text-rose-900 mb-2">Admin Access</h2>
                <p className="text-gray-600">Enter password to access dashboard</p>
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Enter admin password..."
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              <div className="text-center">
                <button
                  onClick={handleAdminLogin}
                  className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                >
                  Login
                </button>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-rose-600 hover:text-rose-800 font-semibold"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Admin Dashboard
  if (currentPage === 'admin' && isAdminAuthenticated) {
    const stats = getStats();

    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="max-w-6xl mx-auto px-4 py-12 animate-fadeIn">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif text-rose-900">Admin Dashboard</h2>
            <div className="flex gap-4">
              <button
                onClick={exportData}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FileText size={16} />
                Export Data
              </button>
              <button
                onClick={() => setIsAdminAuthenticated(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-rose-600 mb-2">{stats.totalGuests}</div>
              <div className="text-gray-600">Total Guests</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.rsvpedYes}</div>
              <div className="text-gray-600">Attending</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.rsvpedNo}</div>
              <div className="text-gray-600">Not Attending</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.checkedIn}</div>
              <div className="text-gray-600">Checked In</div>
            </div>
          </div>

          {/* Guest List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Guest Status</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Guest</th>
                    <th className="text-left py-2">Party Size</th>
                    <th className="text-left py-2">RSVP</th>
                    <th className="text-left py-2">Code</th>
                    <th className="text-left py-2">Check-in</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {GUEST_LIST.map((guest) => {
                    const rsvp = rsvpStatus[guest.id];
                    return (
                      <tr key={guest.id} className="border-b border-gray-100">
                        <td className="py-3">
                          <div className="font-semibold">{guest.name}</div>
                          <div className="text-sm text-gray-600">ID: {guest.id}</div>
                        </td>
                        <td className="py-3">{guest.partySize}</td>
                        <td className="py-3">
                          {rsvp ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              rsvp.attending ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {rsvp.attending ? 'Yes' : 'No'}
                            </span>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </td>
                        <td className="py-3">
                          {rsvp ? (
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {rsvp.code}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          {rsvp && rsvp.checkedIn ? (
                            <span className="text-green-600 font-semibold">✓ Checked In</span>
                          ) : rsvp && rsvp.attending ? (
                            <span className="text-gray-400">Not yet</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          {rsvp && (
                            <button
                              onClick={() => resetGuestRSVP(guest.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-semibold"
                            >
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fraud Attempts */}
          {fraudAttempts.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="text-red-600" />
                Fraud Detection Log
              </h3>
              <div className="space-y-2">
                {fraudAttempts.map((attempt, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-red-800">Invalid Code:</span>
                        <span className="font-mono text-red-700 ml-2">{attempt.code}</span>
                      </div>
                      <div className="text-sm text-red-600">
                        {new Date(attempt.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default WeddingInvitationSystem;
