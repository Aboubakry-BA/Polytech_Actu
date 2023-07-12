//package console;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class WebServiceConsumer {
    private static final Scanner scanner = new Scanner(System.in);
    public static void main(String[] args) {
        try {
            System.out.println("Entrez votre login : ");
            String login = scanner.nextLine();

            System.out.println("Entrez votre mot de passe : ");
            String password = scanner.nextLine();

            // Appeler le service d'authentification pour vérifier les droits d'administration
            boolean verifierConnexion = authentifierUtilisateur(login, password);
            while (verifierConnexion) {
                System.out.println("Que souhaitez-vous faire ?");
                System.out.println("1. Créer un utilisateur");
                System.out.println("2. Récupérer un utilisateur");
                System.out.println("3. Mettre à jour un utilisateur");
                System.out.println("4. Supprimer un utilisateur");
                System.out.println("5. Générer token utilisateur");
                System.out.println("6. Supprimer token utilisateur");
                System.out.println("7. Se Déconnecter du service");

                String choice = scanner.nextLine();

                switch (choice) {
                    case "1" : {
                        String response1 = ajouterUtilisateur();
                        System.out.println(formatXml(response1));
                        break;
                    }
                    case "2" : {
                        String response2 = obtenirUtilisateurParId();
                        System.out.println(formatXml(response2));
                        break;
                    }
                    case "3" : {
                        String response3 = modifierUtilisateur();
                        System.out.println(formatXml(response3));
                        break;
                    }
                    case "4" : {
                        String response4 = supprimerUtilisateur();
                        System.out.println(formatXml(response4));
                        break;
                    }
                    case "5" : {
                        String response5 = genererTokenUtilisateur();
                        System.out.println(formatXml(response5));
                        break;
                    }
                    case "6" : {
                        String response6 = supprimerTokenUtilisateur();
                        System.out.println(formatXml(response6));
                        break;
                    }
                    case "7" : {
                        System.out.println("Au revoir et à bientôt !");
                        verifierConnexion = false;
                        break;
                    }
                    default : System.out.println("Choix invalide.");
                }
            }
        } catch (Exception e) {
            // Gérer les autres exceptions non spécifiées
            e.printStackTrace();
        }
    }
    public static boolean authentifierUtilisateur(String login, String password) {
        // Construire la requête XML avec le login et le mot de passe
        String requestXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:com=\"http://com.al.soap\" xmlns:tns=\"http://com.al.soap\">\n" +
                "    <soapenv:Header/>\n" +
                "    <soapenv:Body>\n" +
                "        <com:authentifierUtilisateurRequest>\n" +
                "            <com:login>" + login + "</com:login>\n" +
                "            <com:motDePasse>" + password + "</com:motDePasse>\n" +
                "        </com:authentifierUtilisateurRequest>\n" +
                "    </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        // Envoyer la requête au service web et retourner la réponse formatée
        String response = sendSoapRequest(requestXml);
        System.out.println(formatXml(response));

        // Extraire les informations de la réponse XML
        String token = extractElementValue(response, "ns2:token");
        String type = extractElementValue(response, "ns2:type");
        // Vérifier si le type de l'utilisateur est "ADMIN"
        if(!("ADMIN".equals(type))){
            System.out.println("Authentification echoué. Vous n'avez les droits d'administration.");
            return false;
        }else{
            if ((token == null)){
                System.out.println("Authentification echoué. Vous ne disposez pas du token.");
                return false;
            }
        }
        System.out.println("Authentification réussie. Vous avez les droits d'administration.");
        return true;
    }

    private static String extractElementValue(String xml, String elementName) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new InputSource(new StringReader(xml)));

            Element element = (Element) document.getElementsByTagName(elementName).item(0);
            if (element != null) {
                return element.getTextContent();
            }
        } catch (ParserConfigurationException e) {
            // Gérer l'exception ParserConfigurationException
            e.printStackTrace();
        } catch (SAXException e) {
            // Gérer l'exception SAXException
            e.printStackTrace();
        } catch (IOException e) {
            // Gérer l'exception IOException
            e.printStackTrace();
        } catch (Exception e) {
            // Gérer les autres exceptions non spécifiées
            e.printStackTrace();
        }

        return null;
    }

    public static String ajouterUtilisateur() {
        System.out.println("Entrez le login du nouvel utilisateur : ");
        String newLogin = scanner.nextLine();

        System.out.println("Entrez le mot de passe du nouvel utilisateur : ");
        String newPassword = scanner.nextLine();

        System.out.println("Entrez le rôle du nouvel utilisateur : ");
        String newRole = scanner.nextLine();

        // Construire la requête XML avec les détails de l'utilisateur
        String requestXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:com=\"http://com.al.soap\" xmlns:tns=\"http://com.al.soap\">\n" +
                "    <soapenv:Header/>\n" +
                "    <soapenv:Body>\n" +
                "        <com:ajouterUtilisateurRequest>\n" +
                "            <com:utilisateur>\n" +
                "                <tns:id></tns:id>\n" +
                "                <tns:login>" + newLogin + "</tns:login>\n" +
                "                <tns:motDePasse>" + newPassword + "</tns:motDePasse>\n" +
                "                <tns:token></tns:token>\n" +
                "                <tns:type>" + newRole + "</tns:type>\n" +
                "            </com:utilisateur>\n" +
                "        </com:ajouterUtilisateurRequest>\n" +
                "    </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        // Envoyer la requête au service web
        return sendSoapRequest(requestXml);
    }

    public static String obtenirUtilisateurParId() {
        System.out.println("Entrez l'ID de l'utilisateur à récupérer : ");
        String id = scanner.nextLine();

        // Construire la requête XML avec l'ID de l'utilisateur
        String requestXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:com=\"http://com.al.soap\" xmlns:tns=\"http://com.al.soap\">\n" +
                "    <soapenv:Header/>\n" +
                "    <soapenv:Body>\n" +
                "        <com:obtenirUtilisateurParIdRequest>\n" +
                "            <com:id>" + id + "</com:id>\n" +
                "        </com:obtenirUtilisateurParIdRequest>\n" +
                "    </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        // Envoyer la requête au service web
        return sendSoapRequest(requestXml);
    }

    public static String modifierUtilisateur() {
        System.out.println("Entrez l'ID de l'utilisateur à mettre à jour : ");
        String id = scanner.nextLine();

        System.out.println("Entrez le nouveau login : ");
        String newLogin = scanner.nextLine();

        System.out.println("Entrez le nouveau mot de passe : ");
        String newPassword = scanner.nextLine();

        System.out.println("Entrez le nouveau rôle : ");
        String newRole = scanner.nextLine();

        // Construire la requête XML avec les détails de l'utilisateur
        String requestXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:com=\"http://com.al.soap\" xmlns:tns=\"http://com.al.soap\">\n" +
                "    <soapenv:Header/>\n" +
                "    <soapenv:Body>\n" +
                "        <com:modifierUtilisateurRequest>\n" +
                "            <com:utilisateur>\n" +
                "                <tns:id>" + id + "</tns:id>\n" +
                "                <tns:login>" + newLogin + "</tns:login>\n" +
                "                <tns:motDePasse>" + newPassword + "</tns:motDePasse>\n" +
                "                <tns:token>ABC123456789</tns:token>\n" +
                "                <tns:type>" + newRole + "</tns:type>\n" +
                "            </com:utilisateur>\n" +
                "        </com:modifierUtilisateurRequest>\n" +
                "    </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        // Envoyer la requête au service web
        return sendSoapRequest(requestXml);
    }

    public static String supprimerUtilisateur() {
        System.out.println("Entrez l'ID de l'utilisateur à supprimer : ");
        String id = scanner.nextLine();

        // Construire la requête XML avec l'ID de l'utilisateur
        String requestXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:com=\"http://com.al.soap\" xmlns:tns=\"http://com.al.soap\">\n" +
                "    <soapenv:Header/>\n" +
                "    <soapenv:Body>\n" +
                "        <com:supprimerUtilisateurRequest>\n" +
                "            <com:id>" + id + "</com:id>\n" +
                "        </com:supprimerUtilisateurRequest>\n" +
                "    </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        // Envoyer la requête au service web
        return sendSoapRequest(requestXml);
    }

    public static String genererTokenUtilisateur() {
        System.out.println("Entrez l'ID de l'utilisateur à récupérer : ");
        String id = scanner.nextLine();
        // Construire la requête XML avec l'ID de l'utilisateur
        String requestXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:com=\"http://com.al.soap\" xmlns:tns=\"http://com.al.soap\">\n" +
                "    <soapenv:Header/>\n" +
                "    <soapenv:Body>\n" +
                "        <com:genererTokenUtilisateurRequest>\n" +
                "            <com:id>" + id + "</com:id>\n" +
                "        </com:genererTokenUtilisateurRequest>\n" +
                "    </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        // Envoyer la requête au service web
        return sendSoapRequest(requestXml);
    }

    public static String supprimerTokenUtilisateur() {
        System.out.println("Entrez l'ID de l'utilisateur à récupérer : ");
        String id = scanner.nextLine();
        // Construire la requête XML avec l'ID de l'utilisateur
        String requestXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" " +
                "xmlns:com=\"http://com.al.soap\" xmlns:tns=\"http://com.al.soap\">\n" +
                "    <soapenv:Header/>\n" +
                "    <soapenv:Body>\n" +
                "        <com:supprimerTokenUtilisateurRequest>\n" +
                "            <com:id>" + id + "</com:id>\n" +
                "        </com:supprimerTokenUtilisateurRequest>\n" +
                "    </soapenv:Body>\n" +
                "</soapenv:Envelope>";

        // Envoyer la requête au service web
        return sendSoapRequest(requestXml);
    }

    public static String sendSoapRequest(String requestXml) {
        try {
            URL url = new URL("http://localhost:8080/ws/users");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "text/xml");

            connection.setDoOutput(true);
            OutputStream outputStream = connection.getOutputStream();
            outputStream.write(requestXml.getBytes(StandardCharsets.UTF_8));
            outputStream.flush();
            outputStream.close();

            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            StringBuilder responseBuilder = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line);
            }
            String responseXml = responseBuilder.toString();

            connection.disconnect();

            return responseXml;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "";
    }

    public static String formatXml(String xml) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new InputSource(new StringReader(xml)));

            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            transformerFactory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");

            StringWriter writer = new StringWriter();
            StreamResult result = new StreamResult(writer);
            DOMSource source = new DOMSource(document);
            transformer.transform(source, result);

            return writer.toString();
        } catch (ParserConfigurationException | SAXException | IOException | TransformerException e) {
            e.printStackTrace();
        }

        return "";
    }
}

